"use strict"
$(function () {
    var bool_traverse = false,
        bool_battue = false,
        bool_vantaux = false,
        error_text = '';
    //Vas vérifier si il y a bien 200mm de difference entre le hx actuel de le hx précédent
    $('.hx').on({
        change: function (evt) {
            if (this.id != 'h1' && !this.disabled && $('#h' + (parseInt(this.id[1]) - 1)).val()) {
                console.log(this.id + ' : ' + this.value + '\n' + $('#h' + (parseInt(this.id[1]) - 1))["0"].id + ' : ' + $('#h' + (parseInt(this.id[1]) - 1)).val());
                console.log((this.value - $('#h' + (parseInt(this.id[1]) - 1)).val()));
                if ((this.value - $('#h' + (parseInt(this.id[1]) - 1)).val() < 200)) {
                    console.log('attention');
                    this.classList.add('border_error');
                } else {
                    this.classList.remove('border_error');
                }
                // (this.value - $('#h' + (parseInt(this.   id[1]) - 1)).val()) < 200 ? this.classList.add('border_error') : this.classList.remove('border_error')
            }
        }
    });
    $('#button').click(function (evt) {
        var validator = {};
        ($('.input_val').filter(function (i, elem) {
            if (!this.hasAttribute('disabled')) {
                // console.log(this.id);
                validator[this.id] = this.value;
            }
        }));
        if ($("input[name='vent']:checked").length != 0) {
            console.log('Nombre de ventaux : ', $("input[name='vent']:checked").val());

            validator[$("input[name='vent']:checked")["0"].id] = $("input[name='vent']:checked").val();
        } else {
            validator['battue'] = '';
        }
        // .push( $("input[name='vent']:ch.ecked").val());
        // console.log(validator)
        console.log('Champs requis : ');
        for (let elem in validator) {
            console.log(elem);

        }
        _checker(validator);
    });

    function _checker(validator) {
        var str = '';
        for (var elem in validator) {
            // console.log(elem+" : "+validator[elem]);

            if (!validator[elem] || validator[elem] == 0)
                str += 'Probleme avec ' + elem + '\n';
        }
        if (str) {
            alert(str);
        } else {
            console.log('Tout OK, envoi de votre commande au serveur');
            _sendCommand(validator);
        }
    }

    function _sendCommand(validator) {
        console.log('Sending to serveur', validator);
        // var str = '';
        
        $.ajax({
            type: 'POST',
            url: 'http://localhost:3000/newcommand',
            data: JSON.stringify({Details : validator}),
            success: function(data){
                console.log(data);
            }
        });
    }
    //desactive les elements en fonction des ventaux choisis
    $('input[name="vent"]').change(function (evt) {
        bool_vantaux = true;
        switch (evt.target.value) {
            case "Gauche":
                $('#Longueur').removeAttr('disabled');
                $('#battue, #Largeur').attr('disabled', '');
                break;
            case "GaucheDroit":
                $('#Longueur, #battue, #Largeur').removeAttr('disabled', '');
                break;
            case "Droit":
                $('#Longueur, #battue').attr('disabled', '');
                $('#Largeur').removeAttr('disabled');
                break;
        }
    });
    //Entoure de rouge les border des input qui pose probleme
    $('.input_val').change(function (evt) {
        if (evt.target.dataset.minl || evt.target.dataset.maxl) {
            switch (evt.target.type) {
                case "text":
                    (evt.target.value.length < evt.target.dataset.minl || evt.target.value.length > evt.target.dataset.maxl) ? evt.target.classList.add('border_error'): evt.target.classList.remove('border_error');
                    break;
                case "number":
                    if (evt.target.id != 'Nombre_traverse' && !evt.target.classList.contains('hx'))
                        (parseInt(evt.target.value) < parseInt(evt.target.dataset.minl) || parseInt(evt.target.value) > parseInt(evt.target.dataset.maxl) ? evt.target.classList.add('border_error') : evt.target.classList.remove('border_error'));
                    break;
            }
        }
    });
    //Vas griser les hX non nécéssaire et vas attester que l'utilisateurs à bien choisis
    // manuellement la battue et le nombre de traverse
    $('select').change(function (evt) {
        if (!bool_battue || !bool_traverse) {
            if (evt.target.id == "battue") {
                $('#battue option[value="0"]').remove();
                bool_battue = true;
            }
            if (evt.target.id == "Nombre_traverse") {
                $('#Nombre_traverse option[value="0"]').remove();
                bool_traverse = true;
                $('#h1').removeAttr('disabled');
                $('.hx').each(function (i, elm) {
                    parseInt(elm.id.substr(1, 2)) > evt.target.value ? elm.setAttribute('disabled', '') : elm.removeAttribute('disabled');
                });
            }
        }
    });
    //Ecoute tout les changement sur les elements qui pourrait changer l'image afficher 
    $('.image_changer').change(function (evt) {
        if (bool_traverse && bool_vantaux)
            $('#to_dipslay')["0"].src = './images/' + $("input[name='vent']:checked")["0"].value + $('#Nombre_traverse')["0"].value + '.png'
    })
    $('#button_test').click(function (evt) {})
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