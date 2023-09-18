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
const toMg = Str => {
    if(Number(Str).toString() !== NaN.toString()) return Number(Str);
    let nums = Str.toString().match((/.\d+.\d+|\d+.\d+|.\d+|\d+/))[0];
    if ( nums.match(/\//)){
        match = nums.match(/\d+/g);
        nums = match[0]/match[1];
    }
    if(Str.toString().match((/[A-Za-z]+$/)) === null) return Number(nums);
    let identity = Str.match((/[A-Za-z]+$/)).toString().toLowerCase();
    return Number(nums)*weights[identity];
}
class Solution{
    name;
    totalMg = 0;
    products = {};

    get constituents(){
        return [...new Set(Object.values(this.products).flatMap(product => Object.keys(product.constituents)))];
    }
    get total(){
        return Object.values( this.products)
            .reduce( (acc,cur)=> acc + cur.total, 0);
    }
    calc( type = "json"){
        if( this.totalMg !== this.total) throw new Error("[ERROR] Failed to calculate total correctly. Inconsistencies with percentages would occur.");
        let totals = {}
        type === 'string' ? console.log("Percent ratio of every Element and Product inside the solution:") : null;
        for (let productName in this.products) {
            let product = this.products[productName];
            type === 'string' ? console.log(`Product Name: ${productName}`) : null;
            for (let constituent in product.constituents) {
                let weight = product.constituents[constituent];
                let percent = (weight / this.total * 100).toFixed(2);
                type === 'string' ? console.log(`Element: ${constituent}, Weight: ${weight}mg, Percent: ${percent}%`) : null;
                if( totals[constituent]){
                    totals[constituent] += weight;
                } else { totals[constituent] = weight }
            }
            type === 'string' ? console.log(``) : null;
        }
        switch(type){
            case "json":
                console.log(JSON.stringify(totals));
                break;
            case "string":
                Object.entries(totals).forEach( element=>{
                    let percent = ((element[1]/this.totalMg)*100).toFixed(2)
                    console.log(`Element ${element[0]} ${percent}% - ${element[1]}mg`)
                    console.log(`\tCup: ${(toMg("1 cup")*(percent/100)).toFixed(2)}mg\t\tfl.oz: ${(toMg("1 fl.oz")*(percent/100)).toFixed(2)}mg`);
                    console.log(`\tTbsp: ${(toMg("1 tbsp")*(percent/100)).toFixed(2)}mg\t\tTsp: ${(toMg("1 tsp")*(percent/100)).toFixed(2)}mg`);
                    console.log(`\tstick: ${(toMg("1 stick")*(percent/100)).toFixed(2)}mg\t\tgram: ${(toMg("1 g")*(percent/100)).toFixed(2)}mg`);
                })
                break;
            case "php":
                break;
        }
    }
    addProduct( Product){
        let identifier = '';
        let nextAvailable = this.products[Product.name] ? Object.keys(this.products).filter(key => key.startsWith(Product.name)).length + 1 : '';
        identifier = nextAvailable > 1 ? ` ${nextAvailable}` : '';
        this.products[Product.name + identifier] = Product;
        this.totalMg += Product.total;
    }
    constructor( name = 'Default Solution') {
        this.name = name;

    }
}

class Product{
    total = 0;
    constituents = {};
    add(name, amount){
        let weight = toMg(amount);
        this.constituents[name] ? this.constituents[name] += weight : this.constituents[name] = weight;
        this.total += weight;
        return this;
    }
    at( total){
        total = toMg(total);
        let product = new Product( this.name);
        Object.entries( this.constituents).forEach( cons =>{
            product.add( cons[0], (total / this.total) * cons[1])
        })
        return product;
    }
    constructor(name = 'Default Product'){
        this.name = name;
    }
}

let JelloGummies = new Product( "Jello Gummies")
    .add("Jello", "7 oz")
    .add("Water", "1/2 cup")
    .add("MCT", "1/3 cup");

let Test = new Product( "Distillate Shit")
    .add("D8-Distillate", "1.75g")
    .add("Sunflower Lecithin", "2g")
    .add("Polysorbate 20", "1.5g");

let product1 = new Product()
    .add("Delta-8", ".98 g")
    .add("Delta-9", ".5 g")
    .add("Mct Oil", "30ml");

let solution = new Solution();

solution.addProduct(JelloGummies);
solution.addProduct(Test);

//console.log(solution)
//console.log(solution.constituents)
solution.calc("string");
