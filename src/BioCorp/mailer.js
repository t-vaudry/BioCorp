var config = require('../ribozyme-design-executor/config/'), 
    nodemailer = require('nodemailer');

module.exports = exports = mailer = {};
var smtpTransport = null;

if(config.environment == "AWS"){
	smtpTransport = nodemailer.createTransport("SES", {
		AWSAccessKeyID: config.awsAccessKeyId,
		AWSSecretKey: config.awsSecretKey,
		SeviceUrl: config.seviceUrl
	});
} else {
	smtpTransport = nodemailer.createTransport("SMTP",{
		service: "Gmail",
		auth: {
			user: config.user_smtp,
			pass: config.pass_smtp
		}
	});
}

var host = config.host;

mailer.notifyCustomer = function(content, callback){
	var receiver = content.emailaddr;
	var subject = "Order confirmation from Biocorp";
	var message = "Hello,<br/><p>Your following order is now confirmed.<br/><br/>Regards,<br/>The Biocorp Team</p>";

	if(content.wellPlates == undefined) content.wellPlates = "";

    message += "<table>\
        <tbody>\
        <tr>\
            <th>Name</th>\
            <td>" + content.firstname + " " + content.lastname + "</td>\
        </tr>\
        <tr>\
            <th>Account</th>\
            <td>" + content.accHolder + "</td>\
        </tr>\
        <tr>\
            <th>Institution</th>\
            <td>" + content.institution + "</td>\
        </tr>\
        <tr>\
            <th>P. O. Number</th>\
            <td>" + content.ponumber + "</td>\
        </tr>\
        <tr>\
            <th>Date Requirement</th>\
            <td>" + content.datereq + "</td>\
        </tr>\
        <tr>\
            <th>In 96 well plates</th>\
            <td>" + content.wellPlates + "</td>\
        </tr>\
        </tbody>\
    </table><br/>";
	var order = content.order;
	for (var i = 0; i < order.length; i++){
		if(order[i].orderType == "oligo"){
		message += "<table>\
			<thead>\
			<th>5' Modification</th>\
			<th>3' Modification</th>\
			<th>Sequence</th>\
			<th>Purity</th>\
			<th>Scale</th>\
			</thead>\
			<tbody>\
			<tr>\
				<td>" + order[i].modif5 + "</td>\
				<td>" + order[i].modif3 + "</td>\
				<td>" + order[i].sequence + "</td>\
				<td>" + order[i].purity + "</td>\
				<td>" + order[i].scale + "</td>\
			</tr>\
			</tbody>\
		</table>";
		} else if(order[i].orderType == "bulkOligo") {
		message += "<table>\
			<thead>";
			for (key in order[i].orderList[0]){
				message += "<th>" + key + "</th>";
			}
			message += "</thead>\
			<tbody>";
			for (var j = 0; j < order[i].orderList.length; j++){
			message += "<tr>";
				for (key in order[i].orderList[j]){
					message += "<td>" + order[i].orderList[j][key] + "</td>";
				}
			message += "</tr>";
			}
			message += "</tbody>\
		</table>";
		} else if(order[i].orderType == "ribozymeDesignOligo"){
		message += "<table class='table table-hover table-condensed'>\
			<thead>\
			<th>Sequence</th>\
			<th>Melting<br/>Temperature (&deg;C)</th>\
			<th>Accessibility 1</th>\
			<th>Accessibility 2</th>\
			<th>Ribozyme<br/>Shape Quality</th>\
			<th>Weighted<br/>off-target hits</th>\
			</thead>\
			<tbody>\
				<td>" + order[i].orderItem.Sequence + "</td>\
				<td>" + order[i].orderItem.MeltingTemperatureList + "</td>\
				<td>" + order[i].orderItem.Fitness_Target + "</td>\
				<td>" + order[i].orderItem.Fitness_Target_dG + "</td>\
				<td>" + order[i].orderItem.Fitness_Shape + "</td>\
				<td>" + order[i].orderItem.Fitness_Specificity + "</td>\
				<tr>";
					if(order[i].orderItem.prime5Enzyme['name'].length > 0){
					message += "<th colspan='1'>5' Restriction Enzyme</th>\
					<td colspan='1'>"
						+ order[i].orderItem.prime5Enzyme['name'] + " (" + order[i].orderItem.prime5Enzyme['seq'] + ")\
					</td>";
					}
					if(order[i].orderItem.prime3Enzyme['name'].length > 0){
					message += "<th colspan='1'>3' Restriction Enzyme</th>\
					<td colspan='3'>" 
						+ order[i].orderItem.prime3Enzyme['name'] + " (" + order[i].orderItem.prime5Enzyme['seq'] + ")\
					</td>";
					}
				message += "</tr>";
				if(order[i].orderItem.primer.length > 0){
				message += "<tr>\
					<th colspan='1'>Primer Sequence</th>\
					<td colspan='5'>" + order[i].orderItem.primer + "</td>\
				</tr>";
				}
			message += "</tbody>\
		</table>";
		}

	}

	var mailOptions = {
		from: "Biocorp <"+config.user_smtp+">", 
		to: receiver, 
		subject: subject,
		html: message
	};

	smtpTransport.sendMail(mailOptions, function(err){
		if(err){
			console.log(err);
		} else {
			callback(true);
			if(config.environment != "AWS")
				smtpTransport.close();
		}
	});
}