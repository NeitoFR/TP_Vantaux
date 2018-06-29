"use strict"
$(function () {
    var refList = [],
        bool_selectRef = false;
    _getRefList();

    //Verifier que la ref n'existe pas déjà
    $('#Reference').change(function (evt) {
        console.log('Checking if ref exist', refList);

        for (let i = 0; i < refList.length; i++) {
            if (evt.target.value == refList[i]) {
                evt.target.classList.add('border_error2');
                console.log('Attention cette reférence existe déjà');
                $('#button').attr('disabled', '');
                break;
            } else {
                evt.target.classList.remove('border_error2');
                $('#button').removeAttr('disabled', '');
            }
        }
    });

    $('#refList').on('change', '#refs', function (evt) {
        console.log("S'lu", evt.target.value);

        if (!bool_selectRef) {
            bool_selectRef = true;
            $('#refs option[value="0"]').remove();
        }
        _getCommandDetails(evt.target.value);
    });

    function _getRefList() {
        $.ajax({
            type: 'GET',
            url: 'http://localhost:3000/getRefList',
            success: function (data) {
                data.length != 0 ? _buildSelect(data) : $('#refList').html("<p>No command listed yet </p>");

                data.forEach(element => {
                    var temp = element.split(' ');
                    refList.push(temp[0]);
                });
            }
        });
    }

    function _buildSelect(data) {
        var selectList = '<select name="refs" id="refs"><option value="0"></option>';
        data.forEach(ref => {
            selectList += '<option value=' + ref + '>' + ref + "</option>";
        });
        selectList += '</select>'
        $('#refList').html(selectList);
    }

    function _getCommandDetails(ref) {
        $.ajax({
            type: 'GET',
            url: 'http://localhost:3000/getCommandByRef/' + ref,
            success: function (data) {
                console.log(data);
                _fillForm(data.Details);
            }
        });
    }

    function _fillForm(obj) {
        var keys = Object.keys(obj);
        console.log('za', keys, obj);
        // console.log($('#h1'), $('#h12'));
        if ($.inArray('battue', keys) > -1) {
            $('#battue option[value=' + obj["battue"] + ']').prop('selected', true);
            $('#battue').removeAttr('disabled');
            $('#battue option[value="0"]').remove();
        }
        for(var i = 0; i < keys.length; i++){
            if(keys[i].includes('Ventail')){
                $('#'+keys[i]).prop('checked', true);
                break;
            }
        }
        keys.forEach(key => {
            if ($('#' + key + '').length != 0 && !key.includes('Ventail')) {
                console.log($('#' + key));
                
                switch ($('#' + key + '')["0"].type) {
                    case "number":
                    case "text":
                        $('#' + key).val(obj[key]);
                        $('#' + key).removeAttr('disabled');
                        break;
                    case "select-one":
                        $('#' + key + ' option[value=' + obj[key] + ']').prop('selected', true);
                        $('#Nombre_traverse option[value="0"]').remove();
                        break;
                }
            }
        });
    }
});