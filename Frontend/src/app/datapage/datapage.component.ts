import { Component, OnInit } from '@angular/core';
import { AbstractControl, ValidatorFn, FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import {Observable} from 'rxjs';
import {map, startWith} from 'rxjs/operators';
// Follow these steps if you have a "Cannot find module 'chart.js/auto'" error
// 1. go to "Frontend" folder
// 2. In console type "npm install chart.js"
import { Chart } from 'chart.js/auto';

@Component({
  selector: 'app-datapage',
  templateUrl: './datapage.component.html',
  styleUrls: ['./datapage.component.css']
})
export class DatapageComponent implements OnInit {
    max = 120;
    min = 0;
    step = 10;
    thumbLabel = true;
    slideStart = 0;
    slideEnd = 120;
    inputGroup: FormGroup;
    sexGroup: FormGroup;
    ageGroup: FormGroup;
    demoGroup: FormGroup;
    dispositionGroup: FormGroup;
    locationGroup: FormGroup;
    filteredOptions: Observable<string[]>;
    chart: any;
    graphData: any;
    graphType: number;
    tempString: any;
    show = {
        dataCheck: false,
    }

    options: string[] = ["ABRASIVE CLEANERS", "ACIDS", "ADHESIVES", "ADULT BED RAILS", "AEROSOL CONTAINERS", "AIR CONDITIONERS", "AIR PURIFIERS", "AIRCRAFT", "ALUMINUM FOIL WRAPPING PRODUCTS", "ANIMAL INDUCED INJURY", "ANIMAL TRAPS", "ANTIFREEZE", "ANTIHISTAMINES", "AQUARIUMS OR ACCESSORIES", "ART SUPPLIES OR EQUIPMENT", "ARTIFICIAL CHRISTMAS TREES", "ARTIFICIAL FLOWERS OR PLANTS", "ARTIFICIAL LIMBS", "ARTIFICIAL TURF", "ASHTRAYS", "ASPIRIN OR ASPIRIN COMPOUNDS", "ASPIRIN SUBSTITUTES", "ATOMIZING DEVICES", "ATTACHED HIGHCHAIR", "AUTOMATIC DOORS OR DOOR OPENERS", "AUTOMATIC GARAGE DOORS OR DOOR OPENERS", "AUTOMOTIVE CHEMICALS", "AUTOMOTIVE TOOLS OR ACCESSORIES", "BABY BATHS OR BATHINETTES", "BABY BOTTLES OR NIPPLES", "BABY CARRIAGES", "BABY CHANGING TABLES", "BABY EXERCISERS", "BABY GATES OR BARRIERS", "BABY HARNESSES", "BABY MATTRESSES OR PADS", "BABY RATTLES", "BABY SCALES", "BABY SLINGS AND WRAPS", "BABY STROLLERS", "BABY WALKERS OR JUMPERS", "BAND SAWS", "BARSTOOLS OR KITCHEN STOOLS", "BASSINETS OR CRADLES", "BATH OR FACIAL CLEANSING BRUSHES", "BATH PRODUCTS", "BATHTUBS OR SHOWERS", "BATONS", "BATTERIES", "BEACH CHAIRS OR FOLDING CHAIRS", "BED RAILS", "BEDSPRINGS OR BEDFRAMES", "BENCH OR TABLE SAWS", "BENCHES", "BICYCLES OR ACCESSORIES", "BLEACHERS", "BOILERS", "BOTTLE OPENERS", "BOTTLE WARMERS", "BRACING OR SUPPORTING DEVICES", "BREAD MAKING MACHINES", "BUBBLE BATHS", "BUCKETS OR PAILS", "BUILDING SETS", "BUNK BEDS", "BURGLAR ALARMS", "BUSINESS AND OFFICE MACHINES", "BUTANE OR LP GAS METERS", "CABINET OR DOOR HARDWARE", "CAMPING EQUIPMENT", "CANNING JARS", "CAR BEDS FOR INFANTS", "CARBON MONOXIDE DETECTORS", "CARDBOARD PRODUCTS", "CATALYTIC HEATERS", "CATHETERS", "CAULKING OR SPACKLING COMPOUNDS", "CAUSTICS", "CERAMICS SUPPLIES OR EQUIPMENT", "CHAFING DISHES OR FONDUE POTS", "CHAIN SAWS", "CHARCOAL", "CHEMISTRY SETS OR SCIENCE KITS", "CHRISTMAS TREE LIGHTS", "CHRISTMAS TREE STANDS OR SUPPORTS", "CIGARETTE OR PIPE LIGHTERS", "CLACKER BALLS", "CLOCKS", "CLOTHES STEAMERS", "CLOTHESBRUSHES", "CLOTHESLINES OR CLOTHES DRYING RACKS", "CLOTHESPINS", "CLOTHING ACCESSORIES", "CLOTHING IRONS", "COAL FURNACES", "COAXIAL CABLE", "COINS", "COMBINES OR THRESHING MACHINES", "CONTACT LENSES", "CONTAINERS WITH KEY OPENERS", "CORKSCREWS", "CORN PLANTERS OR GRAIN DRILLS", "COSTUMES OR MASKS", "COTS", "COUNTERS OR COUNTERTOPS", "CRAYONS OR CHALK", "CREAM SEPARATORS", "CRIB EXTENDER RAILS OR YOUTH BED RAILS", "CRIB MOBILES OR CRIB GYMS", "CROP CHOPPERS", "CROP PICKERS", "CUTTING TORCHES", "DAY WEAR", "DECORATIVE YARD EQUIPMENT", "DEHUMIDIFIERS", "DENTAL PADS OR RELINERS", "DENTURES OR FALSE TEETH", "DEPILATORIES OR HAIR REMOVERS", "DESK SUPPLIES", "DIAPER FASTENERS", "DIAPER PAILS", "DIAPERS", "DIESEL FUELS", "DISHWASHER DETERGENTS", "DISHWASHERS", "DISHWASHING LIQUID", "DIVING OR DIVING BOARDS", "DOLL HOUSES AND OTHER PLAY SCENES", "DOOR SILLS OR FRAMES", "DOORSTOPS", "DRAIN CLEANERS", "DRAIN SNAKES", "DRINKING FOUNTAINS", "DRINKING STRAWS", "DRY HEAT IRONS", "DRY ICE", "DUCTWORK FOR HEATING OR COOLING SYSTEMS", "EAR PIERCING DEVICES", "EAR PROTECTION DEVICES", "ELECTRIC BASEBOARD HEATERS", "ELECTRIC BLANKETS OR SHEETS", "ELECTRIC BLENDERS", "ELECTRIC BROOMS", "ELECTRIC CAN OPENERS", "ELECTRIC CHANDELIERS OR OTHER ATTACHED LIGHT FIXTURES", "ELECTRIC CHARCOAL LIGHTERS", "ELECTRIC CLOTHES DRYERS WITHOUT WASHERS", "ELECTRIC COFFEE MAKERS OR TEAPOTS", "ELECTRIC COMBS", "ELECTRIC CORN POPPERS", "ELECTRIC DEEP FRYERS", "ELECTRIC FENCES", "ELECTRIC FRYING PANS AND SKILLETS", "ELECTRIC FURNACES", "ELECTRIC GRIDDLES", "ELECTRIC GRILLS", "ELECTRIC HEATING PADS", "ELECTRIC IMMERSION WATER HEATERS", "ELECTRIC KETTLES OR HOT POTS", "ELECTRIC KNIFE SHARPENERS", "ELECTRIC MIXERS", "ELECTRIC OUTLETS OR RECEPTACLES", "ELECTRIC OVENS", "ELECTRIC RAZORS OR SHAVERS", "ELECTRIC SCISSORS", "ELECTRIC SHOE POLISHERS", "ELECTRIC SOLDERING EQUIPMENT", "ELECTRIC TIMERS", "ELECTRIC TOY IRONS", "ELECTRIC TOY OVENS", "ELECTRIC TOY RACING CARS OR ACCESSORIES", "ELECTRIC TRAINS OR ACCESSORIES", "ELECTRIC WAFFLE IRONS", "ELECTRIC WATER HEATERS", "ELECTRIC WELDING EQUIPMENT", "ELECTRICAL TESTING EQUIPMENT", "ELEVATORS OR OTHER LIFTS", "ENDGATE SEEDERS", "ENGINE FUELS FOR MODELS", "ESCALATORS", "EXERCISE EQUIPMENT", "EXTENSION CORDS", "EXTENSION LADDERS", "EXTENSION OR STRAIGHT LADDERS", "EYE MASCARAS", "EYE PROTECTION DEVICES", "EYEGLASSES", "EYELINERS", "FABRIC TREATMENT PRODUCTS", "FACE CARE PREPARATIONS", "FACE HORMONE CREAMS", "FANS", "FARM ELEVATORS OR CONVEYORS", "FARM MOWERS", "FARM SPRAYERS", "FARM TILLAGE EQUIPMENT", "FARM TRACTORS", "FARM WAGONS", "FAUCET WATER HEATERS", "FAUCETS OR SPIGOTS", "FENCES OR FENCE POSTS", "FERTILIZERS AND OTHER CHEMICALS FOR OUTDOOR USE", "FILTERS", "FIRE ESCAPE DEVICES", "FIRE EXTINGUISHERS", "FIRE OR SMOKE ALARMS", "FIRE SPRINKLERS", "FIREPLACE EQUIPMENT", "FIREWORKS", "FIRST AID EQUIPMENT", "FLARES", "FLOOR BUFFERS OR WAXERS", "FLOOR WAXES", "FLOORS OR FLOORING MATERIALS", "FLUOROSCOPIC EQUIPMENT", "FLYING DISCS AND BOOMERANGS", "FLYING TOYS", "FOOD GRINDERS", "FOOD PROCESSORS", "FOOD SKEWERS", "FOOD WARMERS", "FOOTLOCKERS", "FOOTWEAR", "FORAGE HARVESTERS", "FORK LIFTS OR LIFT TRUCKS", "FRAGRANCE PREPARATIONS", "FUEL CHARCOAL LIGHTERS", "FUEL STORAGE TANKS", "FUELS FOR CHAFING DISHES OR FONDUE POTS", "FURNITURE POLISHES OR WAXES", "FUTONS", "GARBAGE DISPOSERS", "GARDEN SPRAYERS", "GARDEN TRACTORS", "GAS CLOTHES DRYERS WITHOUT WASHERS", "GAS FUMES OR GAS VAPORS OF UNKNOWN ORIGIN", "GAS FURNACES", "GAS OR LP FLOOR OR WALL HEATERS", "GAS OVENS", "GAS RANGES OR OVENS", "GAS WATER HEATERS", "GASOLINE", "GASOLINE CANS", "GASTROENTEROLOGICAL OR UROLOGICAL DEVICES", "GENERAL HOME OR ROOM INVOLVEMENT IN FIRES", "GENERAL OR PLASTIC SURGERY DEVICES", "GENERAL PURPOSE HOUSEHOLD CLEANERS", "GENERATORS OR POWER PLANTS", "GENITAL AREA PRODUCTS", "GERMICIDAL LAMPS", "GLASS ALCOHOLIC BEVERAGE BOTTLES", "GLASS BATHTUB OR SHOWER ENCLOSURES", "GLASS BOTTLE CUTTING EQUIPMENT", "GLASS DOORS OR DOORS WITH GLASS PANELS", "GLASS DRINKING GLASSES", "GLASS SOFT DRINK BOTTLES", "GLASS TUBING OR TEST TUBES", "GLUE GUNS", "GREENHOUSE OR GARDENING SUPPLIES", "GROUND WATER SLIDES", "GUNPOWDER OR AMMUNITION", "GYMNASTICS AND ASSOCIATED EQUIPMENT", "HACKSAWS", "HAIR CLIPPERS AND TRIMMERS", "HAIR COLORING SHAMPOOS", "HAIR DRYERS", "HAIR GROOMING PREPARATIONS", "HAIR SPRAYS", "HAIR WAVING PREPARATIONS OR STRAIGHTENERS", "HAMMERS", "HAMMOCKS", "HAND AND BODY CREAMS OR LOTIONS", "HAND SAWS", "HARD CONTACT LENSES", "HATCHETS OR AXES", "HAY PROCESSING EQUIPMENT", "HEARING AIDS", "HEAT OR INFRARED LAMPS", "HEAT PUMPS", "HIGH CHAIRS", "HOME PASTEURIZERS", "HOT PLATES", "HOT TUBS OR HOME SPAS", "HOT WATER", "HOUSEPLANTS", "HOVERBOARDS AND POWERED SKATEBOARDS", "HUMIDIFIERS", "HYPODERMIC NEEDLES OR SYRINGES", "ICE CREAM MAKERS", "ICE CRUSHERS", "ICE PICKS", "INCINERATORS", "INDUSTRIAL EQUIPMENT", "INFANT DEATH", "INFLATABLE FURNITURE", "INFLATABLE TOYS", "INSECT INDUCED INJURIES", "INTRAOCULAR DEVICES", "INVITRO DIAGNOSTIC KITS", "IRONING BOARDS OR COVERS", "IRRIGATION EQUIPMENT", "JALOUSIE GLASS WINDOWS", "JEWELRY", "JIGSAWS", "JUICERS", "KEROSENE", "KEROSENE GRILLS OR STOVES", "KEROSENE OR OIL HEATERS", "KIDNEY DIALYSIS MACHINES", "KITES OR KITE STRING", "KNIVES WITH REPLACEABLE BLADES", "LAMP OILS", "LAPIDARY EQUIPMENT", "LASER POINTERS", "LASERS", "LAUNDRY BASKETS", "LAUNDRY HAMPERS", "LAUNDRY SOAPS OR DETERGENTS", "LAWN VACUUMS", "LEAF BLOWERS", "LEVELS", "LIGHT BULBS", "LIGHTER FLUIDS", "LINIMENTS OR RUBBING COMPOUNDS", "LIQUID DRUGS", "LIQUID ROOM DEODORIZERS OR FRESHENERS", "LOCKERS", "LOG SPLITTERS", "LUBRICANTS", "LUGGAGE", "LUNCH BOXES OR PAILS", "LYE", "MAGAZINE RACKS OR BOOK ENDS", "MANGLE IRONS", "MANUAL CLEANING EQUIPMENT", "MANUAL DRILLS", "MANUAL FILING OR SANDING TOOLS", "MANUAL HEDGE TRIMMERS", "MANUAL LAWN TRIMMERS OR EDGERS", "MANUAL SCISSORS", "MANUAL SNOW OR ICE REMOVAL TOOLS", "MANURE SPREADERS", "MARBLES", "MASSAGE DEVICES OR VIBRATORS", "MATCHBOOKS", "MEDICAL EQUIPMENT", "MEDICAL GLOVES", "MENTAL HEALTH SERVICES STUDY", "METAL CONTAINERS", "METAL OR PLASTIC MOLDING SETS", "MICROWAVE OVENS", "MILKING MACHINES", "MINIBIKES OR TRAIL BIKES", "MIRRORS OR MIRROR GLASS", "MOBILE HOMES", "MOLDING COMPOUNDS", "MONKEY BARS OR OTHER PLAYGROUND CLIMBING APPARATUS", "MOTH REPELLENTS", "MOVING WALKS", "MUSIC BOXES OR CHIMES", "MUSICAL INSTRUMENTS", "NAIL GUNS OR STUD DRIVERS", "NAIL HARDENERS", "NAIL PREPARATIONS", "NIGHTWEAR", "NO PRODUCT", "NONBABY MATTRESSES", "NONCOLORING HAIR SHAMPOOS", "NONELECTRIC BLANKETS", "NONELECTRIC CAN OPENERS", "NONELECTRIC KNIFE SHARPENERS", "NONELECTRIC RAZORS OR SHAVERS", "NONELECTRIC SOLDERING EQUIPMENT", "NONELECTRIC TOOTHBRUSHES", "NONGLASS BATHTUB OR SHOWER ENCLOSURES", "NONGLASS BOTTLES OR JARS", "NONGLASS DRINKING GLASSES", "NONPORTABLE CRIBS", "NONSEXUAL INTIMATE PARTNER VIOLENCE", "NONUPHOLSTERED RECLINER CHAIRS", "NONUPHOLSTERED ROCKING CHAIRS", "OBSTETRICAL OR GYNECOLOGICAL DEVICES", "OIL FURNACES", "ORAL HYGIENE PRODUCTS", "ORTHODONTIC BRACES", "ORTHOPEDIC BRACES", "OSTOMY APPLIANCES", "OTHER BABY CARRIERS", "OTHER BEDDING", "OTHER CHAIRS", "OTHER CLOTHING", "OTHER CONTAINERS", "OTHER COOKWARE", "OTHER CROP PROCESSING EQUIPMENT", "OTHER DRUGS OR MEDICATIONS", "OTHER ELECTRIC LIGHTING EQUIPMENT", "OTHER FURNITURE", "OTHER GLASS BOTTLES OR JARS", "OTHER GLASS DOORS", "OTHER GRILLS OR STOVES", "OTHER GUNS OR FIREARMS", "OTHER HAIR COLORING PREPARATIONS", "OTHER HEATERS OR HEATING SYSTEMS", "OTHER HOSPITAL OR PERSONAL USE MEDICAL DEVICES", "OTHER LADDERS", "OTHER MANUAL PRUNING OR TRIMMING EQUIPMENT", "OTHER MANUAL WORKSHOP TOOLS", "OTHER OVENS", "OTHER PLANTING EQUIPMENT", "OTHER PLAYGROUND EQUIPMENT", "OTHER POLISHES", "OTHER PORTABLE OR STATIONARY POWER TOOLS", "OTHER POWER GARDEN TOOLS", "OTHER POWER PRUNING OR TRIMMING EQUIPMENT", "OTHER POWER SAWS", "OTHER PRODUCT", "OTHER RANGES OR OVENS", "OTHER SOFT BABY CARRIERS", "OTHER SPECIFIED PLASTIC PRODUCTS", "OTHER STOOLS", "OTHER TOY GUNS", "OTHER UNPOWERED GARDEN TOOLS", "OTHER UPHOLSTERED CHAIRS", "OTHER WATER HEATERS", "OTHER WINDOWS OR WINDOW GLASS", "OUTDOOR AWNINGS OR SHUTTERS", "OUTDOOR ELECTRIC LIGHTING EQUIPMENT", "OUTERWEAR", "OVEN CLEANERS", "OVERLAY DEATHS", "OXYGEN ADMINISTRATION APPARATUS", "PACIFIERS OR TEETHING RINGS", "PAINT SPRAYERS", "PAINT THINNERS OR VARNISH THINNERS", "PAPER BAGS", "PAPER CUTTERS", "PAPER MONEY OR COINS", "PAPER PRODUCTS", "PARTY FAVORS", "PENS AND PENCILS", "PERSONAL PROTECTION DEVICES", "PESTICIDES", "PET SUPPLIES", "PHONOGRAPH RECORDS", "PHOTOGRAPHIC CHEMICALS", "PHOTOGRAPHIC EQUIPMENT", "PILLOWS", "PINE OIL CLEANING AND DISINFECTANT PREPARATIONS", "PINS AND NEEDLES", "PLANT FOODS OR FERTILIZERS FOR POTTED PLANTS", "PLASTIC BAGS", "PLASTIC PANELS FOR DOORS OR WINDOWS", "PLASTIC WRAPPING PRODUCTS", "PLAYPENS", "POGO STICKS", "POLES", "PORTABLE CIRCULAR POWER SAWS", "PORTABLE CRIBS", "PORTABLE ELECTRIC HEATERS", "PORTABLE FOOD OR BEVERAGE COOLERS", "PORTABLE GAS OR LP HEATERS", "PORTABLE POWER DRILLS AND ACCESSORIES", "PORTABLE SWIMMING POOLS", "POTTY CHAIRS OR TRAINING SEATS", "POWDER PREPARATIONS", "POWER HACK SAWS", "POWER HEDGE TRIMMERS", "POWER JOINTERS", "POWER LATHES", "POWER LAWN TRIMMERS OR EDGERS", "POWER LEAF MULCHERS AND GRINDERS", "POWER ROUTERS", "POWER SANDERS", "POWER SHAPERS", "POWER TILLERS OR CULTIVATORS", "POWERED RIDING TOYS", "POWERED TOOTHBRUSHES OR ORAL IRRIGATORS", "PREPARATIONS CONTAINING IRON SALTS", "PRESSURE COOKERS OR CANNERS", "PROJECTORS", "PUMP JACKS", "RADIAL ARM SAWS", "RADIATION THERAPY EQUIPMENT", "RADIOGRAPHIC EQUIPMENT", "RAMPS OR LANDINGS", "RANGE OR OVEN ACCESSORIES", "REAMERS", "RECLINER CHAIR", "RECORDING TAPES", "REEL POWER LAWN MOWERS", "REFRIGERATORS", "RESPIRATORY PROTECTION DEVICES", "RIDING POWER LAWN MOWERS", "ROCKETRY SETS", "ROCKING CHAIR", "ROPE OR STRING", "ROTARY POWER LAWN MOWERS", "ROTISSERIES", "RUG SHAMPOOERS", "RUST PREVENTATIVES", "RUST REMOVERS", "SABRE SAWS", "SAFES", "SAFETY PINS", "SAUNAS", "SCAFFOLDING", "SCHOOL EQUIPMENT", "SCHOOL LABORATORY CHEMICALS", "SCREEN DOORS", "SCREWDRIVERS", "SEASONAL DECORATIONS", "SEED AND FERTILIZER SPREADERS", "SEEDS", "SEPARATE GARAGES OR TOOL SHEDS", "SEWING BASKET ARTICLES", "SEWING MACHINES OR ACCESSORIES", "SEXUAL VIOLENCE", "SHAVING PREPARATIONS", "SHEETS OR PILLOWCASES", "SHOE POLISHES", "SINKS", "SLEDS", "SLEEPING BAGS", "SLICERS AND CHOPPERS", "SLIDES OR SLIDING BOARDS", "SLIDING GLASS DOORS OR PANELS", "SLIPCOVERS", "SLOW COOKERS", "SNOW DISKS", "SNOW PLOWS", "SOAPS", "SOFT CONTACT LENSES", "SOLID ROOM DEODORIZERS OR FRESHENERS", "SPECIAL BEDS OR ORTHOPEDIC BEDS", "SPOT REMOVERS OR CLEANING FLUIDS", "SQUEEZE OR SQUEAKER TOYS", "STAIRS OR STEPS", "STANCHIONS", "STATIONARY POWER DRILLS AND ACCESSORIES", "STEAM IRONS", "STEP STOOLS", "STEPLADDERS", "STILTS", "STORM DOORS WITH GLASS PANELS", "STORM DOORS WITHOUT GLASS PANELS", "STORM WINDOWS", "STRAIGHT LADDERS", "STRETCH CORDS OR STRETCH STRAPS", "SUN LAMPS", "SUNTAN BOOTHS", "SUNTAN OR SUNSCREEN PREPARATIONS", "SURGE SUPPRESSORS OR POWER STRIPS", "SWIMMING POOL CHEMICALS", "SWIMMING POOL EQUIPMENT", "SWIMMING POOL SLIDES", "SWINGS OR SWING SETS", "TABLE LINENS", "TABLET OR CAPSULE DRUGS", "TABLEWARE AND ACCESSORIES", "TARPAULINS", "TELEPHONES OR TELEPHONE ACCESSORIES", "TELEVISION TABLES OR STANDS", "TELEVISIONS", "THERAPEUTIC EQUIPMENT", "THERMAL OR SOUND INSULATION MATERIALS", "TOASTERS", "TOBOGGANS", "TODDLER BEDS", "TOILET BOWL PRODUCTS", "TOILETS", "TOMBSTONES OR GRAVE MARKERS", "TOOL SHEDS", "TOOLBOXES OR TOOL KITS", "TOWEL RACKS OR BARS", "TOWELS OR CLOTHS", "TOY BOWS OR ARROWS", "TOY BOXES OR CHESTS", "TOY GUNS WITH PROJECTILES", "TOY MUSICAL INSTRUMENTS", "TOY SPORTS EQUIPMENT", "TRAFFIC CONTROL DEVICES", "TRAINS", "TRAMPOLINES", "TRASH COMPACTORS", "TREEHOUSES OR PLAYHOUSES", "TRICYCLES", "TROUBLE LIGHTS OR EXTENSION WORK LIGHTS", "TURPENTINE", "UMBRELLAS", "UNATTACHED APPLIANCE OR LAMP CORDS", "UNCATEGORIZED PRODUCT", "UNICYCLES", "UNPOWERED COFFEE MAKERS OR TEAPOTS", "UNPOWERED MODELS OR PARTS", "UPHOLSTERED RECLINER CHAIRS", "UPHOLSTERED ROCKING CHAIRS", "UTILITY VEHICLES UTV", "VACUUM CLEANERS", "VACUUM CONTAINERS", "VAPORIZERS", "VENDING MACHINES", "VETERINARY MEDICINES", "VISES OR WORKSHOP CLAMPS", "WADING POOLS", "WALLPAPER", "WALLPAPER STEAMERS", "WASHING MACHINES WITH UNHEATED SPIN DRYERS", "WASHING MACHINES WITHOUT WRINGERS OR OTHER DRYERS", "WATCHES", "WATER TOYS", "WATERBEDS OR WATER PILLOWS", "WELDING EQUIPMENT", "WHEELBARROWS OR LAWN CARTS", "WHEELCHAIRS", "WINDOW OR DOOR SECURITY BARRIERS", "WINDOW SCREENS", "WINDOW SILLS OR FRAMES", "WINDROWERS OR SWATHERS", "WINDSHIELD WIPER FLUIDS", "WOOD PANELING AND PARTICLEBOARD", "WOODBURNING KITS", "WOODEN CONTAINERS", "WOODEN MATCHES", "WORKSHOP COMPOUNDS OR CHEMICALS", "WORKSHOP FURNISHINGS", "WRINGER WASHING MACHINES", "YOUTH CHAIRS"];

    yearLabels: string[] = ['2016', '2017', '2018', '2019', '2020', '2021'];
    monthLabels: string[] = ['Jan 2016', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec',
                             'Jan 2017', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec',
                             'Jan 2018', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec',
                             'Jan 2019', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec',
                             'Jan 2020', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec',
                             'Jan 2021', 'Feb', 'Mar', 'Apr', 'May','June','July','Aug','Sept','Oct','Nov','Dec',];
    seasonLabels: string[] = ['Winter 2016', 'Spring', 'Summer', 'Fall',
                              'Winter 2017', 'Spring', 'Summer', 'Fall',
                              'Winter 2018', 'Spring', 'Summer', 'Fall',
                              'Winter 2019', 'Spring', 'Summer', 'Fall',
                              'Winter 2020', 'Spring', 'Summer', 'Fall',
                              'Winter 2021', 'Spring', 'Summer', 'Fall',];

    public search = new FormControl('', { validators: [autocompleteStringValidator(this.options), Validators.required] });

    public validation_msgs = {
        'search': [
            { type: 'invalidAutocompleteString', message: 'Product not recognized.' },
            { type: 'required', message: 'Product is required.' }
        ]
    };

    constructor(private http: HttpClient, private _formBuilder: FormBuilder) {}

    ngOnInit() {
        if (localStorage.getItem('Product') != undefined) {
            this.firstTimeGraph(localStorage.getItem('Product')!);
        }
        else
            console.log('ERROR GETTTING THE PRODUCT');

        this.filteredOptions = this.search.valueChanges.pipe(
            startWith(''),
            map(value => this._filterLabels(value || '')),
        );
        this.inputGroup = this._formBuilder.group({
            search: new FormControl('', { validators: [autocompleteStringValidator(this.options), Validators.required] }),
            unit: new FormControl('year')
        });
        this.ageGroup = this._formBuilder.group({
            ageStart: new FormControl(this.slideStart),
            ageEnd: new FormControl(this.slideEnd)
        });
        this.sexGroup = this._formBuilder.group({
            male: false,
            female: false,
            otherSex: false
        }); 
        this.demoGroup = this._formBuilder.group({
            white: false,
            black: false,
            asian: false,
            AI: false,
            PI: false,
            otherDemo: false
        });
        this.dispositionGroup = this._formBuilder.group({
            TR: false,
            hospitalized: false,
            fatality: false,
            otherDisp: false
        });
        this.locationGroup = this._formBuilder.group({
            home: false,
            farm: false,
            street: false,
            MH: false,
            city: false,
            school: false,
            factory: false,
            sport: false,
            otherLoc: false
        });
    }
    firstTimeGraph(inProduct: string) {
        var formData: any = new FormData();
        localStorage.setItem('product', inProduct);
        formData.append('product', inProduct);
        formData.append('unit', 'season');
        localStorage.setItem('unit', 'season');
        formData.append('ageStart', 0);
        formData.append('ageEnd', 120);
        formData.append('male', false);
        formData.append('female', false);
        formData.append('otherSex', false);
        formData.append('white', false);
        formData.append('black', false);
        formData.append('asian', false);
        formData.append('AI', false);
        formData.append('PI', false);
        formData.append('otherDemo', false);
        formData.append('TR', false);
        formData.append('hospitalized', false);
        formData.append('fatality', false);
        formData.append('otherDisp', false);
        formData.append('home', false);
        formData.append('farm', false);
        formData.append('street', false);
        formData.append('MH', false);
        formData.append('city', false);
        formData.append('school', false);
        formData.append('factory', false);
        formData.append('sport', false);
        formData.append('otherLoc', false);

        this.http.post('http://localhost:5000/users/sendData', formData)
        .subscribe(data =>{
            this.graphData = data;
            console.log(this.graphData);
            this.graphType = this.graphData.graph_type;
            
            if (this.graphType == 0) 
                console.log('Empty Query... no graph');
            else if (this.graphType == 1)
                console.log('Yearly');
            else if (this.graphType == 2)
                console.log('Monthly');
            else if (this.graphType == 3)
                console.log('Seasonaly');
            else
                console.log('There was an error with the Graph Type number.');
            
            if (this.graphType != 0) {
                for (let i = 0; i < this.graphData.product_structs.length; i++) {
                    const product = this.graphData.product_structs[i].product_title;
                    console.log('Product Title: ', product);
                    for (let j = 0; j < this.graphData.product_structs[i].y_values.length; j++) {
                        const point = this.graphData.product_structs[i].y_values[j];
                        console.log('Y value: ', point);
                    }
                }
            }
            this.createChart(this.graphData);
        });
    }

    send() {
        var formData: any=new FormData();
        this.addDataToSend(formData);
        this.http.post('http://localhost:5000/users/sendData', formData)
        .subscribe(data =>{
            this.graphData = data;
            console.log(this.graphData);
            this.graphType = this.graphData.graph_type;
            console.log(this.graphType);
            
            if (this.graphType == 0) 
                console.log('Empty Query... 0\'d out graph');
            else if (this.graphType == 1)
                console.log('Yearly');
            else if (this.graphType == 2)
                console.log('Monthly');
            else if (this.graphType == 3)
                console.log('Seasonaly');
            else
                console.log('There was an error with the Graph Type number.');
            
            if (this.graphType != 0) {
                for (let i = 0; i < this.graphData.product_structs.length; i++) {
                    const product = this.graphData.product_structs[i].product_title;
                    console.log('Product Title: ', product);
                    for (let j = 0; j < this.graphData.product_structs[i].y_values.length; j++) {
                        const point = this.graphData.product_structs[i].y_values[j];
                        console.log('Y value: ', point);
                    }
                }
            }
            this.createChart(this.graphData);
        });
    }

    addDataToSend(formData: FormData) {
        formData.append('product', this.search.value!);
        localStorage.setItem('Product', this.search.value!);
        formData.append('unit', this.inputGroup.get('unit')?.value);
        localStorage.setItem('unit', this.inputGroup.get('unit')?.value);
        formData.append('ageStart', this.ageGroup.get('ageStart')?.value);
        formData.append('ageEnd', this.ageGroup.get('ageEnd')?.value);
        formData.append('male', this.sexGroup.get('male')?.value);
        formData.append('female', this.sexGroup.get('female')?.value);
        formData.append('otherSex', this.sexGroup.get('otherSex')?.value);
        formData.append('white', this.demoGroup.get('white')?.value);
        formData.append('black', this.demoGroup.get('black')?.value);
        formData.append('asian', this.demoGroup.get('asian')?.value);
        formData.append('AI', this.demoGroup.get('AI')?.value);
        formData.append('PI', this.demoGroup.get('PI')?.value);
        formData.append('otherDemo', this.demoGroup.get('otherDemo')?.value);
        formData.append('TR', this.dispositionGroup.get('TR')?.value);
        formData.append('hospitalized', this.dispositionGroup.get('hospitalized')?.value);
        formData.append('fatality', this.dispositionGroup.get('fatality')?.value);
        formData.append('otherDisp', this.dispositionGroup.get('otherDisp')?.value);
        formData.append('home', this.locationGroup.get('home')?.value);
        formData.append('farm', this.locationGroup.get('farm')?.value);
        formData.append('street', this.locationGroup.get('street')?.value);
        formData.append('MH', this.locationGroup.get('MH')?.value);
        formData.append('city', this.locationGroup.get('city')?.value);
        formData.append('school', this.locationGroup.get('school')?.value);
        formData.append('factory', this.locationGroup.get('factory')?.value);
        formData.append('sport', this.locationGroup.get('sport')?.value);
        formData.append('otherLoc', this.locationGroup.get('otherLoc')?.value);
    }
    
    private _filterLabels(label: string): string[] {
        if (label === '') {
          return this.options.slice()
        }
        const filterValue = label.toLowerCase()
        return this.options.filter(option => option.toLowerCase().includes(filterValue))
    }

    resetAll() {
        this.search.reset();
        this.inputGroup.setValue({search: '', unit: 'year'});
        this.ageGroup.setValue({ageStart: 0, ageEnd: 120});
        this.sexGroup.reset();
        this.demoGroup.reset();
        this.dispositionGroup.reset();
        this.locationGroup.reset();
    }

    createChart(graphData: any) {
        let chartStatus = this.chart;
        if (chartStatus != undefined) {
            chartStatus.destroy();
        }
            // GRAPH FOR EMPTY DATASET
        if (this.graphType == 0) {
            this.show.dataCheck = true;
            var unit = localStorage.getItem('unit');
            console.log('Hello');
            var YCount = 0;
            var tempArray;
            if (unit == 'year')
            {
                YCount = 6;
                tempArray = this.yearLabels;
            }
            else if (unit == 'season') 
            {
                YCount = 48;
                tempArray = this.seasonLabels;
            }
            else if (unit == 'month') 
            {
                YCount = 72;
                tempArray = this.monthLabels;
            }
            else
                console.log('There was an error getting the unit for the default graph.')

            this.chart = new Chart("MyChart", {
                type: 'line', 
                data: {
                    labels: tempArray, 
                    datasets: []
                },
                options: {
                    aspectRatio: 2.5,
                    scales: {
                        x: {
                            title: {
                                display: true,
                                text: 'Time'
                            }
                        },
                        y: {
                            beginAtZero: true,
                            title: {
                                display: true,
                                text: 'Number of Product Related Injuries'
                            }
                        }
                    }
                }  
                });
      
                for (let i = 0; i < 1; i++) {
                    var tempArr:number[] = new Array(YCount);
                    
                    for (let j = 0; j < YCount; j++) {
                        tempArr[j] = 0;
                    }
    
                    //console.log(tempArr);
                    this.tempString = localStorage.getItem('Product');
                    var temp = {
                        label: this.tempString,
                        data: tempArr
                    };
                    this.chart.data.datasets.push(temp);
                }
                    this.chart.update();
        }
            // YEARLY GRAPH
        else if (this.graphType == 1) {
            this.show.dataCheck = false;
            this.chart = new Chart("MyChart", {
            type: 'line', 
            data: {
                labels: this.yearLabels, 
                datasets: []
            },
            options: {
                aspectRatio: 2.5,
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Time (Year)'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'Number of Product Related Injuries'
                        }
                    }
                }
            }  
            });
  
            for (let i = 0; i < this.graphData.product_structs.length; i++) {
                var tempArr:number[] = new Array(this.graphData.product_structs[i].y_values.length);
                
                for (let j = 0; j < this.graphData.product_structs[i].y_values.length; j++) {
                    tempArr[j] = this.graphData.product_structs[i].y_values[j].y_value;
                }

                console.log(tempArr);
                var temp = {
                    label: this.graphData.product_structs[i].product_title,
                    data: tempArr
                };
                this.chart.data.datasets.push(temp);
            }
                this.chart.update();
        }
          // MONTHLY GRAPH
        else if (this.graphType == 2) {
            this.show.dataCheck = false;
            this.chart = new Chart("MyChart", {
                type: 'line',
                data: {
                    labels: this.monthLabels, 
                    datasets: []
                },
                options: {
                    aspectRatio: 2.5,
                    scales: {
                        x: {
                            title: {
                                display: true,
                                text: 'Time (Month)'
                            }
                        },
                        y: {
                            title: {
                                display: true,
                                text: 'Number of Product Related Injuries'
                            }
                        }
                    }
                }  
                });
      
                for (let i = 0; i < this.graphData.product_structs.length; i++) {
                    var tempArr:number[] = new Array(this.graphData.product_structs[i].y_values.length);
                    
                    for (let j = 0; j < this.graphData.product_structs[i].y_values.length; j++) {
                        tempArr[j] = this.graphData.product_structs[i].y_values[j].y_value;
                    }
    
                    console.log(tempArr);
                    var temp = {
                        label: this.graphData.product_structs[i].product_title,
                        data: tempArr
                    };
                    this.chart.data.datasets.push(temp);
                }
                    this.chart.update();
        }
            // SEASONAL GRAPH
        else if (this.graphType == 3) {
            this.show.dataCheck = false;
            this.chart = new Chart("MyChart", {
                type: 'line',
                data: {
                    labels: this.seasonLabels, 
                    datasets: []
                },
                options: {
                    aspectRatio: 2.5,
                    scales: {
                        x: {
                            title: {
                                display: true,
                                text: 'Time (Season)'
                            }
                        },
                        y: {
                            title: {
                                display: true,
                                text: 'Number of Product Related Injuries'
                            }
                        }
                    }
                }  
                });
      
                for (let i = 0; i < this.graphData.product_structs.length; i++) {
                    var tempArr:number[] = new Array(this.graphData.product_structs[i].y_values.length);
                    
                    for (let j = 0; j < this.graphData.product_structs[i].y_values.length; j++) {
                        tempArr[j] = this.graphData.product_structs[i].y_values[j].y_value;
                    }
    
                    console.log(tempArr);
                    var temp = {
                        label: this.graphData.product_structs[i].product_title,
                        data: tempArr
                    };
                    this.chart.data.datasets.push(temp);
                }
                    this.chart.update();
        }
        else {
            console.log('There was an error detecting the graph type number.');
        }
    }
}

function autocompleteStringValidator(validOptions: Array<string>): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (validOptions.indexOf(control.value) !== -1) {
        return null  /* valid option selected */
      }
      return { 'invalidAutocompleteString': { value: control.value } }
    }
}