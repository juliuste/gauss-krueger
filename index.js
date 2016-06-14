'use strict'

/*

Copyright (c) 2006, HELMUT H. HEIMEIER

Permission is hereby granted, free of charge, to any person obtaining a
copy of this software and associated documentation files (the "Software"),
to deal in the Software without restriction, including without limitation
the rights to use, copy, modify, merge, publish, distribute, sublicense,
and/or sell copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included
in all copies or substantial portions of the Software.

*/

function gk2pot(gk){

/* Die Funktion wandelt GK Koordinaten in geographische Koordinaten
   um. Rechtswert rw und Hochwert hw müssen gegeben sein.
   Berechnet werden geographische Länge lp und Breite bp
   im Potsdam Datum. */

// Rechtswert rw und Hochwert hw im Potsdam Datum
   if (!gk || !gk.x || !gk.y)
      return null
   

   let rw = parseFloat(gk.x)
   let hw = parseFloat(gk.y)

// Potsdam Datum
// Große Halbachse a und Abplattung f
   let a = 6377397.155
   let f = 3.342773154e-3
   // f = 3.34277321e-3
   let pi = Math.PI

// Polkrümmungshalbmesser c
   let c = a/(1-f)

// Quadrat der zweiten numerischen Exzentrizität
   let ex2 = (2*f-f*f)/((1-f)*(1-f))
   let ex4 = ex2*ex2
   let ex6 = ex4*ex2
   let ex8 = ex4*ex4

// Koeffizienten zur Berechnung der geographischen Breite aus gegebener
// Meridianbogenlänge
   let e0 = c*(pi/180)*(1 - 3*ex2/4 + 45*ex4/64  - 175*ex6/256  + 11025*ex8/16384)
   let f2 =   (180/pi)*(    3*ex2/8 -  3*ex4/16  + 213*ex6/2048 -   255*ex8/4096)
   let f4 =              (180/pi)*(   21*ex4/256 -  21*ex6/256  +   533*ex8/8192)
   let f6 =                           (180/pi)*(   151*ex6/6144 -   453*ex8/12288)

// Geographische Breite bf zur Meridianbogenlänge gf = hw
   let sigma = hw/e0
   let sigmr = sigma*pi/180
   let bf = sigma + f2*Math.sin(2*sigmr) + f4*Math.sin(4*sigmr) + f6*Math.sin(6*sigmr)

// Breite bf in Radianten
   let br = bf * pi/180
   let tan1 = Math.tan(br)
   let tan2 = tan1*tan1
   let tan4 = tan2*tan2

   let cos1 = Math.cos(br)
   let cos2 = cos1*cos1

   let etasq = ex2*cos2

// Querkrümmungshalbmesser nd
   let nd = c/Math.sqrt(1 + etasq)
   let nd2 = nd*nd
   let nd4 = nd2*nd2
   let nd6 = nd4*nd2
   let nd3 = nd2*nd
   let nd5 = nd4*nd

//  Längendifferenz dl zum Bezugsmeridian lh
   let kz = parseInt(rw/1e6)
   let lh = kz*3
   let dy = rw-(kz*1e6+500000)
   let dy2 = dy*dy
   let dy4 = dy2*dy2
   let dy3 = dy2*dy
   let dy5 = dy4*dy
   let dy6 = dy3*dy3

   let b2 = - tan1*(1+etasq)/(2*nd2)
   let b4 =   tan1*(5+3*tan2+6*etasq*(1-tan2))/(24*nd4)
   let b6 = - tan1*(61+90*tan2+45*tan4)/(720*nd6)

   let l1 =   1/(nd*cos1)
   let l3 = - (1+2*tan2+etasq)/(6*nd3*cos1)
   let l5 =   (5+28*tan2+24*tan4)/(120*nd5*cos1)

// Geographischer Breite bp und Länge lp als Funktion von Rechts- und Hochwert
   let bp = bf + (180/pi) * (b2*dy2 + b4*dy4 + b6*dy6)
   let lp = lh + (180/pi) * (l1*dy  + l3*dy3 + l5*dy5)

   if (lp < 5 || lp > 16 || bp < 46 || bp > 56){
      console.log("RW und/oder HW ungültig für das deutsche Gauss-Krüger-System")
      return null
   }
   return {'x': lp, 'y': bp}
}

// -----------------------------------------------------------------------

function pot2wgs(pot){

/* Die Funktion verschiebt das Kartenbezugssystem (map datum) vom in
   Deutschland gebräuchlichen Potsdam-Datum zum WGS84 (World Geodetic
   System 84) Datum. Geographische Länge lp und Breite bp gemessen in
   grad auf dem Bessel-Ellipsoid müssen gegeben sein.
   Ausgegeben werden geographische Länge lw und
   Breite bw (in grad) auf dem WGS84-Ellipsoid.
   Bei der Transformation werden die Ellipsoidachsen parallel
   verschoben um dx = 587 m, dy = 16 m und dz = 393 m. */

// Geographische Länge lp und Breite bp im Potsdam Datum
   if (!pot || !pot.x || !pot.y)
      return null

   let lp = parseFloat(pot.x)
   let bp = parseFloat(pot.y)

// Quellsystem Potsdam Datum
// Große Halbachse a und Abplattung fq
   let a = 6378137.000 - 739.845
   let fq = 3.35281066e-3 - 1.003748e-05

// Zielsystem WGS84 Datum
// Abplattung f
   let f = 3.35281066e-3

// Parameter für datum shift
   let dx = 587
   let dy = 16
   let dz = 393

// Quadrat der ersten numerischen Exzentrizität in Quell- und Zielsystem
   let e2q = (2*fq-fq*fq)
   let e2 = (2*f-f*f)

// Breite und Länge in Radianten
   let pi = Math.PI
   let b1 = bp * (pi/180)
   let l1 = lp * (pi/180)

// Querkrümmungshalbmesser nd
   let nd = a/Math.sqrt(1 - e2q*Math.sin(b1)*Math.sin(b1))

// Kartesische Koordinaten des Quellsystems Potsdam
   let xp = nd*Math.cos(b1)*Math.cos(l1)
   let yp = nd*Math.cos(b1)*Math.sin(l1)
   let zp = (1 - e2q)*nd*Math.sin(b1)

// Kartesische Koordinaten des Zielsystems (datum shift) WGS84
   let x = xp + dx
   let y = yp + dy
   let z = zp + dz

// Berechnung von Breite und Länge im Zielsystem
   let rb = Math.sqrt(x*x + y*y)
   let b2 = (180/pi) * Math.atan((z/rb)/(1-e2))

   let l2

   if (x > 0)
     l2 = (180/pi) * Math.atan(y/x)
   if (x < 0 && y > 0)
     l2 = (180/pi) * Math.atan(y/x) + 180
   if (x < 0 && y < 0)
     l2 = (180/pi) * Math.atan(y/x) - 180

   return {'lat': b2, 'lon': l2}
}

// -----------------------------------------------------------------------

function wgs2pot(wgs){

/* Die Funktion verschiebt das Kartenbezugssystem (map datum) vom
   WGS84 Datum (World Geodetic System 84) zum in Deutschland
   gebräuchlichen Potsdam-Datum. Geographische Länge lw und Breite
   bw gemessen in grad auf dem WGS84 Ellipsoid müssen
   gegeben sein. Ausgegeben werden geographische Länge lp
   und Breite bp (in grad) auf dem Bessel-Ellipsoid.
   Bei der Transformation werden die Ellipsoidachsen parallel
   verschoben um dx = -587 m, dy = -16 m und dz = -393 m.
   Fehler berichten Sie bitte an Helmut.Heimeier@t-online.de*/

// Geographische Länge lw und Breite bw im WGS84 Datum
   if (!wgs || !wgs.lat || !wgs.lon)
      return null
   let lw = parseFloat(wgs.lon)
   let bw = parseFloat(wgs.lat)

// Quellsystem WGS 84 Datum
// Große Halbachse a und Abplattung fq
   let a = 6378137.000
   let fq = 3.35281066e-3

// Zielsystem Potsdam Datum
// Abplattung f
   let f = fq - 1.003748e-5

// Parameter für datum shift
   let dx = -587
   let dy = -16
   let dz = -393

// Quadrat der ersten numerischen Exzentrizität in Quell- und Zielsystem
   let e2q = (2*fq-fq*fq)
   let e2 = (2*f-f*f)

// Breite und Länge in Radianten
   let pi = Math.PI
   let b1 = bw * (pi/180)
   let l1 = lw * (pi/180)

// Querkrümmungshalbmesser nd
   let nd = a/Math.sqrt(1 - e2q*Math.sin(b1)*Math.sin(b1))

// Kartesische Koordinaten des Quellsystems WGS84
   let xw = nd*Math.cos(b1)*Math.cos(l1)
   let yw = nd*Math.cos(b1)*Math.sin(l1)
   let zw = (1 - e2q)*nd*Math.sin(b1)

   // Kartesische Koordinaten des Zielsystems (datum shift) Potsdam
   let x = xw + dx
   let y = yw + dy
   let z = zw + dz

// Berechnung von Breite und Länge im Zielsystem
   let rb = Math.sqrt(x*x + y*y)
   let b2 = (180/pi) * Math.atan((z/rb)/(1-e2))

   let l2

   if (x > 0)
     l2 = (180/pi) * Math.atan(y/x)
   if (x < 0 && y > 0)
     l2 = (180/pi) * Math.atan(y/x) + 180
   if (x < 0 && y < 0)
     l2 = (180/pi) * Math.atan(y/x) - 180

   if (l2 < 5 || l2 > 16 || b2 < 46 || b2 > 56)
      return null
   
   return {'x': l2, 'y': b2}
}

// -----------------------------------------------------------------------

function pot2gk(pot){

/* Die Funktion wandelt geographische Koordinaten in GK Koordinaten
   um. Geographische Länge lp und Breite bp müssen im Potsdam Datum
   gegeben sein. Berechnet werden Rechtswert rw und Hochwert hw.
   Fehler berichten Sie bitte an Helmut.Heimeier@t-online.de*/

   //Geographische Länge lp und Breite bp im Potsdam Datum
   if (!pot || !pot.x || !pot.y)
      return null
   let lp = parseFloat(pot.x)
   let bp = parseFloat(pot.y)

// Grenzen des Gauss-Krüger-Systems für Deutschland 46° N < bp < 55° N, 5° E < lp < 16° E
   if (bp < 46 || bp > 56 || lp < 5 || lp > 16){
      console.log("Werte außerhalb des für Deutschland definierten Gauss-Krüger-Systems\n"+" 5° E < LP < 16° E, 46° N < BP < 55° N")
      return null
   }

// Potsdam Datum
// Große Halbachse a und Abplattung f
   let a = 6377397.155
   let f = 3.342773154e-3
   // let f = 3.34277321e-3
   let pi = Math.PI

// Polkrümmungshalbmesser c
   let c = a/(1-f)

// Quadrat der zweiten numerischen Exzentrizität
   let ex2 = (2*f-f*f)/((1-f)*(1-f))
   let ex4 = ex2*ex2
   let ex6 = ex4*ex2
   let ex8 = ex4*ex4

// Koeffizienten zur Berechnung der Meridianbogenlänge
   let e0 = c*(pi/180)*(1 - 3*ex2/4 + 45*ex4/64  - 175*ex6/256  + 11025*ex8/16384)
   let e2 =            c*(  - 3*ex2/8 + 15*ex4/32  - 525*ex6/1024 +  2205*ex8/4096)
   let e4 =                          c*(15*ex4/256 - 105*ex6/1024 +  2205*ex8/16384)
   let e6 =                                    c*( -  35*ex6/3072 +   315*ex8/12288)

// Breite in Radianten
   let br = bp * pi/180

   let tan1 = Math.tan(br)
   let tan2 = tan1*tan1
   let tan4 = tan2*tan2

   let cos1 = Math.cos(br)
   let cos2 = cos1*cos1
   let cos4 = cos2*cos2
   let cos3 = cos2*cos1
   let cos5 = cos4*cos1

   let etasq = ex2*cos2

// Querkrümmungshalbmesser nd
   let nd = c/Math.sqrt(1 + etasq)

// Meridianbogenlänge g aus gegebener geographischer Breite bp
   let g = e0*bp + e2*Math.sin(2*br) + e4*Math.sin(4*br) + e6*Math.sin(6*br)

// Längendifferenz dl zum Bezugsmeridian lh
   let kz = parseInt((lp+1.5)/3)
   let lh = kz*3
   let dl = (lp - lh)*pi/180
   let dl2 = dl*dl
   let dl4 = dl2*dl2
   let dl3 = dl2*dl
   let dl5 = dl4*dl

// Hochwert hw und Rechtswert rw als Funktion von geographischer Breite und Länge
   let hw =  (g + nd*cos2*tan1*dl2/2 + nd*cos4*tan1*(5-tan2+9*etasq)*dl4/24)
   let rw =      (nd*cos1*dl         + nd*cos3*(1-tan2+etasq)*dl3/6 +
               nd*cos5*(5-18*tan2+tan4)*dl5/120 + kz*1e6 + 500000)

   let nk = hw - parseInt(hw)
   if (nk < 0.5)
      hw = parseInt(hw)
   else
      hw = parseInt(hw) + 1

   nk = rw - parseInt(rw)
   if (nk < 0.5)
      rw = parseInt(rw)
   else
      rw = parseInt(rw+1)
   
   return {'x': rw, 'y': hw}
}

// -----------------------------------------------------------------------

function gk2wgs(gk){
   return pot2wgs(gk2pot(gk))
}

// -----------------------------------------------------------------------

function wgs2gk(wgs){
   return pot2gk(wgs2pot(wgs))
}

// -----------------------------------------------------------------------

module.exports = {
   gk2pot : gk2pot,
   pot2wgs : pot2wgs,
   wgs2pot : wgs2pot,
   pot2gk : pot2gk,
   gk2wgs : gk2wgs,
   wgs2gk : wgs2gk
}


/*
const gk = {'x': 4591270, 'y':5819620}

const wgs = gk2wgs(gk)
console.log(wgs)
const gk2 = wgs2gk(wgs)
console.log(gk2)

const pot = gk2pot(gk)
console.log(pot)
const gk3 = pot2gk(pot)
console.log(gk3)

const wgs2 = pot2wgs(pot)
console.log(wgs2)
const pot2 = wgs2pot(wgs2)
console.log(pot2)
*/