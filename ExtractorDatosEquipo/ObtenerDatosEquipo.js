
const Module = require('module');

//funciones para extraer los datos 

async function extraerNombreEquipo(extractor){
    const data = await extractor.osInfo()
    return data.hostname

}


async function extraerNombreCpu(extractor) {
    const data = await extractor.cpu()
    return data.brand
}

async function extraerTamanioRam(extractor) {
        const data = await  extractor.mem()
        const tamaniobytes=data.total;
        const tamanioGb=Math.round((tamaniobytes / (1024 ** 3))).toFixed(2);
        return tamanioGb
}

async function extraerModeloEquipo(extractor) {

    const data = await extractor.system()
    return data.model

}

async function extraerMarcaEquipo(extractor) {
   const data =  await extractor.system()
    return data.manufacturer

}

async function extraerNumeroSerie(extractor) {
    const data = await extractor.bios()
    return data.serial
}

async function extraerTamanioDisco(extractor) {
    
    const data = await extractor.diskLayout()
    const tamaniobytes=data[0].size
    const tamanioGb=Math.round((tamaniobytes / (1024 ** 3))).toFixed(2);
    return tamanioGb

}

async function extraerSo(so){
    const data = await so.version()
    return data
}

//Exports

module.exports = {
        extraerNombreCpu: extraerNombreCpu,
        extraerNombreEquipo:extraerNombreEquipo,
        extraerMarcaEquipo: extraerMarcaEquipo,
        extraerModeloEquipo:extraerModeloEquipo,
        extraerNumeroSerie:extraerNumeroSerie,
        extraerTamanioRam:extraerTamanioRam,
        extraerTamanioDisco:extraerTamanioDisco,
        extraerSo:extraerSo
}
