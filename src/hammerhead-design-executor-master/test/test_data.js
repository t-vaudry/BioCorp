module.exports = {
    longSequence : {
	request : {
	    sequence : 'AUUGUACGCGUCGCACGAUGCAUGCUC',
	    foldShape : 'Basic',
	    temperature : 37,
	    naC: 150,
	    mgC: 0,
	    oligoC: 0,
	    cutsites: ['GUC'],
	    region: '5\'',
	    left_arm_min : 3,
	    left_arm_max : 8,
	    right_arm_min : 3,
	    right_arm_max : 8,
	    specificity : 'cleavage',
	    emailUser : '',
	    organization : '',
	    promoter : true,
	    env: {
		type: 'vitro',
		target: ''
	    }
	},
	results : {}
    },
    multipleRequests : {
	request1 : {
	    sequence : 'AUUGUACGCGUCGCACGAUGCAUGCUC',
	    foldShape : 'Basic',
	    temperature : 37,
	    naC: 150,
	    mgC: 0,
	    oligoC: 0,
	    cutsites: ['GUC'],
	    region: ['5\''],
	    left_arm_min : 3,
	    left_arm_max : 8,
	    right_arm_min : 3,
	    right_arm_max : 8,
	    specificity : 'cleavage',
	    emailUser : '',
	    organization : 'Concordia University',
	    promoter : true,
	    env: {
		type: 'vitro',
		target: ''
	    }
	},
	request2 : {
	    sequence : 'AUUGUACGCGUCGCACGAUGCAUGCUC',
	    foldShape : 'Basic',
	    temperature : 37,
	    naC: 150,
	    mgC: 0,
	    oligoC: 0,
	    cutsites: ['GUC'],
	    region: ['5\''],
	    left_arm_min : 3,
	    left_arm_max : 8,
	    right_arm_min : 3,
	    right_arm_max : 8,
	    specificity : 'cleavage',
	    emailUser : '',
	    organization : 'Concordia',
	    promoter : true,
	    env: {
		type: 'vitro',
		target: ''
	    }
	}
    }
};
