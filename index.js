'use strict'

const proj4 = require('proj4')
const epsg = require('epsg')
const isObject = require('lodash.isobject')
const isNumber = require('lodash.isnumber')

const epsgFromZone = (zone) => 'EPSG:'+(31464+zone) // zone 2 = 31466, zone 5 = 31469

const toWGS = (coordinates) => {
    if(!isObject(coordinates) || !isNumber(coordinates.x) || !isNumber(coordinates.y)){
        throw new Error('missing or invalid parameter `coordinates`')
    }
    if(coordinates.x < 0 || coordinates.x >= Math.pow(10, 7)){
        throw new Error('`coordinates.x` out of bounds')
    }
    if(coordinates.y < 0 || coordinates.y >= Math.pow(10, 7)){
        throw new Error('`coordinates.y` out of bounds')
    }

    const zone = +(coordinates.x+'')[0]

    const projected = proj4.default(epsg[epsgFromZone(zone)], 'WGS84', Object.assign({}, coordinates))
    return ({
        longitude: projected.x,
        latitude: projected.y
    })
}

const toGK = (coordinates, zone) => {
    if(!isObject(coordinates) || !isNumber(coordinates.longitude) || !isNumber(coordinates.latitude)){
        throw new Error('missing or invalid parameter `coordinates`')
    }
    if(coordinates.longitude < -180 || coordinates.longitude > 180){
        throw new Error('`coordinates.longitude` out of bounds')
    }
    if(coordinates.latitude < -360 || coordinates.latitude > 360){
        throw new Error('`coordinates.latitude` out of bounds')
    }

    if(zone){
        if(!isNumber(zone)){
            throw new Error('`zone` parameter must be a number')
        }
        if(![2,3,4,5].includes(zone)){
            throw new Error('if set, `zone` parameter must be one of 2, 3, 4, 5')
        }
    }
    else{
        zone = Math.floor((+coordinates.longitude + 1.5) / 3)
        if(![2,3,4,5].includes(zone)){
            throw new Error('could not detect valid zone (2, 3, 4, 5) from input coordinates')
        }
    }

    const proj4coordinates = {
        x: coordinates.longitude,
        y: coordinates.latitude
    }

    const projected = proj4('WGS84', epsg[epsgFromZone(zone)], proj4coordinates)
    return ({
        x: projected.x,
        y: projected.y
    })
}

module.exports = {toWGS, toGK}
