const weights = {
        mg: 1, milligram: 1,
        ug: .001, microgram: .001,
        gram: 1000, milliliter: 1000,
        g: 1000, ml: 1000,
        'fl.oz': 29573.6, oz: 28000,
        kilogram: 1000000, liter: 1000000,
        kg: 1000000, l: 1000000,
        tsp: 4928.92, tbsp: 14786.8,
        'fluid.oz': 29573.6, cup: 240000.6,
        pint: 473177.6, quart: 473177.6,
        gallon: 3785420.8, stick: 113000,
        megg: 49600, legg: 56800,
        segg: 42500, xlegg: 63800,
        kilo: 1000000, eighth: 3500,
        quarter: 7000, half: 14000,
        zip: 28000,
    }
const WeightParser = Str => {
    let nums = Str.match((/\d+.\d+|\d+/))[0];
    if ( nums.match(/\//)){
        match = nums.match(/\d+/g);
        nums = match[0]/match[1];
    }
    let identity = Str.match((/[A-Za-z]+$/)).toString().toLowerCase();
    console.log(`num [ ${nums} ] identity [ ${identity} ]`)
    return Number(nums)*weights[identity];
}
