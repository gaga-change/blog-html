
const path = require('path')
const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
    res.render('index')
})

module.exports = (app, distPath) => {
    app.set('views', path.resolve(distPath, './html'))    
    app.engine('.html', require('ejs').__express);  
    app.set('view engine', 'html'); 
    app.use(router)
}