var express = require('express');
var router = express.Router();
var firebaseAdminDb = require('../connections/firebase_admin'); 

const categoriesRef = firebaseAdminDb.ref('categories');


router.get('/article', function(req, res, next) {
  res.render('dashboard/article', { title: 'Express' });
});

router.get('/archives', function(req, res, next) {
  res.render('dashboard/archives', { title: 'Express' });
});

router.get('/categories', function(req, res, next) {
  const message = req.flash('info');
  categoriesRef.once('value').then(function(snapshot) {
    const categories = snapshot.val();
    res.render('dashboard/categories', { 
      title: 'Express',
      categories,
      message,
      hasInfo: message.iength > 0
    });

  });
});

router.post('/categories/create', function(req, res) {
  const data = req.body;
  //console.log(data);
  const categoriesPush = categoriesRef.push();
  const key = categoriesPush.key;
  data.id = key;
  categoriesPush.set(data).then(()=>{
    res.redirect('/dashboard/categories');
  });
 
});

router.post('/categories/del/:id',function(req,res){
  const id = req.param('id');
  console.log('id',id);
  categoriesRef.child(id).remove();
  req.flash('info','已刪除');
  res.redirect('/dashboard/categories');
});

module.exports = router;
