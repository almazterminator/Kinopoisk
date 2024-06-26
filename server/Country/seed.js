const Country = require('./country')
const data = [
    'Россия',
    'СССР',
    'США',
    'Казахстан',
    'Франция',
    'Южная Корея',
    'Италия',
    'Великобритания',
    'Швеция',
    'Япония',
    'Германия',
    'Испания',
    'Гонконг',
    'Дания',
    'Бельгия',

]

async function writeDataCountry(){
    const length = await Country.countDocuments();
    if(length == 0){
        data.map((item,index)=>{
            new Country ({
                name: item,
                key: index
            }).save()
        })
    }
}

module.exports = writeDataCountry