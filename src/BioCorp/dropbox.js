var config = require('../ribozyme-design-executor/config/');
var dateFormat = require('dateformat');
var os = require('os');
var file = require('fs');

module.exports = exports = dropbox = {};

dropbox.uploadFile = function(content, callback){
    var file_content = content.order_number + os.EOL;
    var now = new Date();

    file_content += 'Oligo Order File' + os.EOL;
    file_content += dateFormat(now, "m/d/yyyy") + os.EOL;
    file_content += 'Position, OligoName, Sequence, Scale, Purity, 5mod, 3mod, InternalMod' + os.EOL;
    file_content += 'Start SeqInfo' + os.EOL;
    
    for (var index = 0; index < content.order.length; index++)
    {
        if (content.order[index].internmod == undefined) content.order[index].internmod = "FALSE";
        else content.order[index].internmod = "TRUE";

        if (content.order[index].orderType == "oligo")
        {
            file_content += (index+1) + ';';
            file_content += content.order[index].name + ';';
            file_content += content.order[index].sequence + ';';
            file_content += content.order[index].scale + ';';
            file_content += content.order[index].purity + ';';
            file_content += content.order[index].modif5 + ';';
            file_content += content.order[index].modif3 + ';';
            file_content += content.order[index].internmod + ';';
            file_content += os.EOL;
        } else if (content.order[index].orderType == "bulkOligo")
        {
            var position, name, sequence, scale, purity, mod5, mod3, internmod;
            for (var j = 0; j < content.order[index].orderList.length; j++)
            {
                for (key in content.order[index].orderList[j])
                {
                    switch (key)
                    {
                        case "Comments":
                            break;
                        case "Sequence No":
                            position = (index+1) + ';';
                            break;
                        case "Oligo Name":
                            name = content.order[index].orderList[j][key] + ';';
                            break;
                        case "Sequence":
                            sequence = content.order[index].orderList[j][key] + ';';
                            break;
                        case "Scale":
                            scale = content.order[index].orderList[j][key] + ';';
                            break;
                        case "Purity":
                            purity = content.order[index].orderList[j][key] + ';';
                            break;
                        case "5' Modification":
                            mod5 = content.order[index].orderList[j][key] + ';';
                            break;
                        case "3' Modification":
                            mod3 = content.order[index].orderList[j][key] + ';';
                            break;
                        case "Internal Modification":
                            internmod = content.order[index].orderList[j][key] + ';';
                            break;
                        default:
                            break;
                    }
                }
                file_content += position + name + sequence + scale + purity + mod5 + mod3 + internmod;
                file_content += os.EOL;
            }
        }
    }

    file_content += 'End SeqInfo' + os.EOL;
    file_content += 'Comments' + os.EOL;
    
    for (var index = 0; index < content.order.length; index++)
    {
        if (content.order[index].orderType == "oligo")
        {
            file_content += content.order[index].comments + os.EOL;
        } else if (content.order[index].orderType == "bulkOligo")
        {
            for (var j = 0; j < content.order[index].orderList.length; j++)
            {
                for (key in content.order[index].orderList[j])
                {
                    if (key == "Comments")
                        file_content += content.order[index].orderList[j][key] + os.EOL;
                }
            }
        }
    }

    file.writeFile("../../../Dropbox/BCOrders/Orders/" + content.order_number + ".dna6", file_content, function(err) {
        if (err)
            console.log(err);
    });
}