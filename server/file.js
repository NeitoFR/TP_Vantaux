var fs = require('fs');

// fs.writeFile('mynewfile3.txt', 'Hello content!', function (err) {
//   if (err) throw err;
//   console.log('Saved!');
// });

// var moment = require('moment');

console.log(moment().format("DD-MM-YYYY_hh-mm"));

// fs.readFile('./server/tab.json', 'utf8', function(err, data) {
//     if (err) {
//         throw err;
//     }
//     var tab = JSON.parse(data);
//     tab.push({
//         "Reference" : "AZEAET",
//         "H1" : 1553
//     })
//     _writeFile(tab);
// });

// function _writeFile(tab) {
//     fs.writeFile("./server/tab.json", JSON.stringify(tab), function (err) {
//         if (err) {
//             return console.log(err);
//         }
//         console.log("The file was saved!");
//     });
// }