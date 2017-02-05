
//Temp test for pareto front
/*

10|
9 |
8 |      x(0)
7 |
6 |x(2)  x(1) x(0)
5 |
4 |               x(0)
3 |   x(2)  x(1)  
2 |
1 |x  x(3)  x(2)     x(1)  x(0)
0 ______________________________________
   1  2  3  4  5  6  7  8  9  10 



*/
var ParetoFrontRank = require('./index.js').ParetoFrontRank;
var testDataSet =
    [
        { 'effective': 1, 'efficient': 1 },
        { 'effective': 1, 'efficient': 6 },
        { 'effective': 2, 'efficient': 3 },
        { 'effective': 2, 'efficient': 1 },
        { 'effective': 3, 'efficient': 6 },
        { 'effective': 3, 'efficient': 8 },
        { 'effective': 4, 'efficient': 1 },
        { 'effective': 4, 'efficient': 3 },
        { 'effective': 5, 'efficient': 6 },
        { 'effective': 6, 'efficient': 4 },
        { 'effective': 7, 'efficient': 1 },
        { 'effective': 7, 'efficient': 1 },
        { 'effective': 9, 'efficient': 1 }

    ];

var maxRank = ParetoFrontRank(testDataSet, ["effective", "efficient"], [true, true], 0);
for (var xx = 0 ; xx < testDataSet.length; ++xx) {
    console.log("Point (" + testDataSet[xx].effective + ',' + testDataSet[xx].efficient + ') has rank ' + (maxRank - testDataSet[xx].rank));
}

var testDataSet2 =
[
    { 'temp': 51.94, 'acc1':0.648,	'acc2':0, 	'shape':0.615 },
    { 'temp': 53.94, 'acc1':0.416,	'acc2':0, 	'shape':0.615 },
    { 'temp': 51.94, 'acc1':0.446,	'acc2':0.629, 	'shape':0.782 },
    { 'temp': 65.94, 'acc1':0.334,	'acc2':0.629, 	'shape':0.654 },
    { 'temp': 53.94, 'acc1':0.114,	'acc2':0.96, 	'shape':1 },
    { 'temp': 57.94, 'acc1':0.035,	'acc2':0.96, 	'shape':1 },
    { 'temp': 61.94, 'acc1':0.012,	'acc2':0.96, 	'shape':1 },
    { 'temp': 63.94, 'acc1':0.009,	'acc2':0.96, 	'shape':1 },
    { 'temp': 65.94, 'acc1':0.005,	'acc2':0.96, 	'shape':0 },
    { 'temp': 69.94, 'acc1':0,	'acc2':0.96, 	'shape':0.756 },
    { 'temp': 49.94, 'acc1':1,	'acc2':1, 	'shape':1 },
    { 'temp': 53.94, 'acc1':0.648,	'acc2':0, 	'shape':0.615 },
    { 'temp': 55.94, 'acc1':0.416,	'acc2':0, 	'shape':0.615 },
    { 'temp': 51.94, 'acc1':0.662,	'acc2':0.938, 	'shape':0.744 },
    { 'temp': 55.94, 'acc1':0.648,	'acc2':0, 	'shape':0.615 },
    { 'temp': 57.94, 'acc1':0.416,	'acc2':0, 	'shape':0.615 },
    { 'temp': 55.94, 'acc1':0.444,	'acc2':0.629, 	'shape':0.654 },
    { 'temp': 51.94, 'acc1':1, 	'acc2':1, 	'shape':1 },
    { 'temp': 53.94, 'acc1':1, 	'acc2':1, 	'shape':0.897 },
    { 'temp': 57.94, 'acc1':0.648,	'acc2':0, 	'shape':0.615 },
    { 'temp': 59.94, 'acc1':0.416,	'acc2':0, 	'shape':0.615 },
    { 'temp': 57.94, 'acc1':0.44, 	'acc2':0.629, 	'shape':0.654 },
    { 'temp': 55.94, 'acc1':0.662,	'acc2':0.938, 	'shape':0.744 },
    { 'temp': 53.94, 'acc1':1, 	'acc2':1, 	'shape':1 },
    { 'temp': 61.94, 'acc1':0.44, 	'acc2':0.629, 	'shape':0.654 },
    { 'temp': 63.94, 'acc1':0.433,	'acc2':0.629, 	'shape':0.654 },
    { 'temp': 57.94, 'acc1':0.657,	'acc2':0.938, 	'shape':0.744 },
    { 'temp': 63.94, 'acc1':0.655,	'acc2':0.938, 	'shape':0.628 },
    { 'temp': 55.94, 'acc1':1, 	'acc2':1, 	'shape':0.897 },
    { 'temp': 61.94, 'acc1':0.657,	'acc2':0.938, 	'shape':0.744 },
    { 'temp': 65.94, 'acc1':0.65, 	'acc2':0.938, 	'shape':0.859 },
    { 'temp': 59.94, 'acc1':0.668,	'acc2':1, 	'shape':1 },
    { 'temp': 57.94, 'acc1':1, 	'acc2':1, 	'shape':0.897 },
    { 'temp': 57.94, 'acc1':1, 	'acc2':1, 	'shape':1 },
    { 'temp': 63.94, 'acc1':0.663,	'acc2':1, 	'shape':1 },
    { 'temp': 61.94, 'acc1':1, 	'acc2':1, 	'shape':0.897 },
    { 'temp': 63.94, 'acc1':0.668,	'acc2':1, 	'shape':0.897 },
    { 'temp': 67.94, 'acc1':0.663,	'acc2':1, 	'shape':0.897 }
];

var maxRank = ParetoFrontRank(testDataSet2, ["temp", "acc1", "acc2", "shape"], [true, true, true, true], 0);
for (var xx = 0 ; xx < testDataSet2.length; ++xx) {
    console.log("Point (" + testDataSet2[xx].temp + ',' + testDataSet2[xx].acc1 +  ',' + testDataSet2[xx].acc2 + ',' + testDataSet2[xx].shape + ') has rank ' + ( maxRank - testDataSet2[xx].rank));
}
