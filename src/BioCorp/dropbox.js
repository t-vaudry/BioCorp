var config = require('../ribozyme-design-executor/config/'), 
    node_dropbox = require('node-dropbox');
var dateFormat = require('dateformat');

module.exports = exports = dropbox = {};

dropbox.uploadFile = function(content, callback){
    var api = node_dropbox.api(config.access_token);
    var file_content = content.order_number + "\n";
    var now = new Date();

    file_content += "Oligo Order File\n";
    file_content += dateFormat(now, "m/d/yyyy") + "\n";
    file_content += "Position, OligoName, Sequence, Scale, Purity, 5'mod, 3'mod, InternalMod\n";
    file_content += "Start SeqInfo\n";
    
    for (var index = 0; index < content.order.length; index++)
    {
        if (content.order[index].orderType == "oligo")
        {
            file_content += (index+1) + ";";
            file_content += content.order[index].name + ";";
            file_content += content.order[index].sequence + ";";
            file_content += content.order[index].scale + ";";
            file_content += content.order[index].purity + ";";
            file_content += content.order[index].modif5 + ";";
            file_content += content.order[index].modif3 + ";";
            // Internal mod
            file_content += "\n";
        } else if (content.order[index].orderType == "bulkOligo")
        {
            for (var j = 0; j < content.order[index].orderList.length; j++)
            {
                for (key in content.order[index].orderList[j])
                {
                    if (key != "Comments")
                        file_content += content.order[index].orderList[j][key] + ";";
                    else if (key == "Sequence No")
                        file_content += (index+1) + ";";
                }
                file_content += "\n";
            }
        }
    }

    file_content += "End SeqInfo\n";
    file_content += "Comments\n";
    
    for (var index = 0; index < content.order.length; index++)
    {
        if (content.order[index].orderType == "oligo")
        {
            file_content += content.order[index].comments + "\n";
        } else if (content.order[index].orderType == "bulkOligo")
        {
            for (var j = 0; j < content.order[index].orderList.length; j++)
            {
                for (key in content.order[index].orderList[j])
                {
                    if (key == "Comments")
                        file_content += content.order[index].orderList[j][key] + "\n";
                }
            }
        }
    }

    api.createFile(content.order_number + ".dna6", file_content, function(err, res, body) {
        if (err) console.log(err);
    });
}