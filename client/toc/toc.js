import './toc.html'
const TP = Template.toc;


const toc = new ReactiveVar();

TP.onCreated(function(){
  console.log(`toc.onCreated data:`,this.data)
  console.log(`toc.onCreated item_id:`,this.data.item_id())
  Meteor.call('pdf-files-index', (err,data) =>{
    if (err) throw err;
    console.log('pdf-files-index.data:',data)
    // build and populate a reactive var:
    const _h = {};
    data.rows.forEach(it => {
      if (!it.path) {
        it.path = '99.99'
      }
      const {item_id, revision_id, h1, h2} = it;
      const [icat,isec] = it.path.split('.')
      if (!_h[icat]) {
        if (it.path == '99.99')
        _h[icat] = {h1:'messed-up', items:[]};
        else
        _h[icat] = {icat, h1, items:[]};
      }
      _h[icat].items.push(it);
    })
    console.log(_h)
    toc.set(Object.values(_h))
  })
})


TP.helpers({
  toc: ()=>{
    const x = toc.get();
    //console.log(x);
    return x;
  }
})



FlowRouter.route('/toc/:item_id', {
  name: 'toc',
  action: function(params, queryParams){
        console.log('Router::action for: ', FlowRouter.getRouteName());
        console.log(' --- params:',params);
//        document.auteur = "Museum v9";
//        app.article_id.set(undefined);
        BlazeLayout.render('toc',params);
    }
});
