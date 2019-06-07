import './test-css.html';

FlowRouter.route('/test-css', {
  name: 'deep-search',
  action: function(params, queryParams){
        console.log('Router::action for: ', FlowRouter.getRouteName());
        console.log(' --- params:',params);
//        document.auteur = "Museum v9";
//        app.article_id.set(undefined);
        BlazeLayout.render('test-css');
    }
});
