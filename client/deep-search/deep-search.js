const assert = require('assert')
import './deep-search.html';

import '../quick-search/jj-intro.html';
import '../quick-search/jpc-address.html';
import '../quick-search/modal.html';
import '../quick-search/cc-warnings.html';

/*
import '../quick-search/date-range-slider.html'
import '../quick-search/date-range-slider.js'
*/

import '../quick-search/subIndex-panel.html'
import '../quick-search/subIndex-panel.js'

import '../quick-search/article.html'
import '../quick-search/article.js'

import '../quick-search/preview-panel.html'
import '../quick-search/preview-panel.js'


import {bh_init, bh_search} from '../bh-engine.js'
const TP = Template['deep-search'];

import { ReactiveDict } from 'meteor/reactive-dict';

import {app} from '../app-client.js';

// --------------------------------------------------------------------------


TP.onCreated(function(){
  const tp = this;

  app.date_range = new ReactiveDict();
  tp.data_timeStamp = new ReactiveVar(null);
//  tp.data_ready = new ReactiveVar(false);
  tp.data.catalogsCount = new ReactiveVar();
  tp.data.articlesCount = new ReactiveVar();
  tp.data.subIndex_Count = new ReactiveVar(0);

  if (!app.subIndex) throw `fatal no subIndex`;

  Meteor.call('pdf-pages-count',(err,data)=>{
    if (err) throw err;
    const {pdf_count, pdf_pages_count} = data;
    console.log(`${pdf_count} pdf-files -- ${pdf_pages_count} pdf-pages`)
    app.state.set('pdfpagesCount',pdf_pages_count);
    app.state.set('pdfCount', pdf_count);
  })

  // ------------------------------------------------------------------------

  tp.deep_search = function(query) {
    tp.max_results_reached.classList.add('nodisplay')
    //    tp.execute_query(query);
    Meteor.call('deep-search', query, 'u2013_en', 'english', (err,data)=>{
      //tp.etime.set(new Date().getTime() - etime);
      if (err) {
        console.log('ERROR:', err);
//        tp.q.set('q4::Syntax or System Error! retype your query.') // system or syntax error
        return;
      }

      if (!data) {
//        tp.q.set('q3::No result for this query BAD!.');
        console.log(`NO DATA for this.`);
        return
      }

      const {pages, audit, etime} = data;
      console.log(`found ${pages.length} pdf-pages data:`,data)
      tp.data.subIndex_Count.set(pages.length)
      if (pages.length >=500) {
        tp.max_results_reached.classList.remove('nodisplay')
      }
      app.subIndex.set(pages);
      if (pages.length >0) { // OBSOLETE
        app.state.set('show-intro',false)
      }
      tp.busy_flag.classList.add('hidden')

      console.log(`Audit:\n`,audit.join('\n'))


    }); // call deep-search
  } // function dee_search


  /***********************************************************
  this works on window,scroll NOT on our panel. => not ready yet.
  ************************************************************/

  /**************************************************
  $(window).on('scroll', function(e) {
    console.log(`on-scroll...`, e)
    if (document.body.scrollTop > 200 || document.documentElement.scrollTop > 200) {
      document.getElementById("myBtn").style.display = "block";
    } else {
      document.getElementById("myBtn").style.display = "none";
    }
  })
  ***************************************************/

}); // onCreated

// ============================================================================

TP.onRendered(function() {
  const tp = this;
  this.clear_messages = function(){
    console.log('clear-messages');
  }
  const panel = tp.find('div#scrolling-panel')
  const myBtn = tp.find('#myBtn')
  $(panel).on('scroll', function(e) {
//    console.log(`PANEL:: on-scroll...`, e)
    // console.log(`-- scrollTop:${panel.scrollTop}`);
    if (panel.scrollTop > 200) {
      myBtn.style.display = "block";
    } else {
      myBtn.style.display = "none";
    }

  })
});

// ================================================================================

TP.helpers({
  modulo(x,i) {return x && (x%i==0);},
  get_a_pub() {return get_a_pub.next().value;}
});


TP.helpers({
  selected: function(event, suggestion, datasetName) {
    // event - the jQuery event object
    // suggestion - the suggestion object
    // datasetName - the name of the dataset the suggestion belongs to
    // TODO your event handler here
    console.log(event);
    console.log('suggestion:',suggestion);
    console.log(datasetName);
  }
});

TP.helpers({
  show_intro:()=>{
    return app.state.get('show-intro');
  },
  pdfCount() {
    return app.state.get('pdfCount')
  },
  pdfpagesCount() {
    return app.state.get('pdfpagesCount')
  },
  trimfn: (fn)=>{
    return fn.replace(/[0-9]*\.pdf$/,'')
  },

  /*
  data_ready: ()=>{
    return Template.instance().data_ready.get();
  },*/
});


// ================================================================================
/*
https://codepen.io/matthewcain/pen/ZepbeR
https://www.templatemonster.com/blog/back-to-top-button-css-jquery/
*/

TP.events({
  'click #myBtn': (e,tp)=>{
    //console.log('TOPTOP')
    const panel = tp.find('div#scrolling-panel')
    panel.scrollTop = 0;
  }
})


TP.events({
  'typeahead:selected' : (e,tp) =>{
    console.log('typeahead:selected',e);
    return false;
  },
  'typeahead:cursorchange': function(){
    console.log('typeahead:cursorchange');
    return false;
  },
  'typeahead:open': function(){
    console.log('typeahead:open');
    return false;
  },
  'typeahead:render': function(){
    console.log('typeahead:render');
    return false;
  },
  'typeahead:autocomplete' : (e,tp) =>{
    console.log('typeahead:changed',e);
    return false;
  }
});

// ----------------------------------------------------------------------------

TP.events({
  'click .js-deep-search_': (ev,tp)=>{
    // get query from input, not event.
    console.log('js-deep-search:',tp.find('input'));
    const query = tp.find('input').value;
    tp.deep_search(query);
  },
  'keyup': (ev,tp)=>{
    //console.log('search_panel.keyup');
//    tp.q.set('q1::keep typing then - CR to search.'); // button is displayed.
//    tp.hlist.set([]); // results
    if (ev.keyCode == 13) {
      app.state.set('show-intro',false)
      tp.max_results_reached = tp.find('span.js-max_results_reached')
      tp.max_results_reached.classList.add('nodisplay')
      tp.busy_flag = tp.find('div.js-busy-flag');
      tp.busy_flag.classList.remove('hidden')
      tp.deep_search(ev.target.value);
      $(document.activeElement).filter(':input:focus').blur();
    }
  },
});

TP.events({ // doing nothing now.
  'keyup .js-typeahead': (e,tp)=>{
    if (e.key == 'Enter') {
//      console.log('Do something.');
    }
    return false;
  },
});

// ----------------------------------------------------------------------------

TP.events({
  'input .js-typeahead_____': (e,tp)=>{
    tp.clear_messages();
    const value = e.target.value;

    if (value.startsWith('##')) {
      console.log('> list-all index.length:',app.index.length);
      app.subIndex.set(app.index.array());
      //app.subIndex_timeStamp.set(new Date().getTime());
      console.log('> list-all subIndex.length:',app.subIndex.length);
      return false;
    }

    if (value.length < 3) {
      return false;
    }
//      tp.cc_list = asearch(e.target.value);

    /*
    let _searchText = normalize(value.replace(/[,:;\+\(\)\-\.]/g,' '));
    Session.set('actual-search-text',_searchText);
    */

    const results = bh_search(value) // => subIndex - ONLY used here.
    console.log('results.length:',results.length);
    tp.data.subIndex_Count.set(results.length)
    app.subIndex.set(results);
    if (results.length >0) {
      app.state.set('show-intro',false)
    }
    return false;
  }
});

// ----------------------------------------------------------------


// ------------------------------------------------------------------

TP.events({
  'click #js-changer': (e,tp)=>{
    let modal = document.getElementById('myModal');
    e.stopPropagation();
//            FlowRouter.go('index');
    console.log('ESC');
    console.log('modal.style.display:',modal.style.display);
    if (modal.style.display == "block") {
      modal.style.display = 'none';
      var span = document.getElementsByClassName("close")[0];
      span.onclick = function() {
        modal.style.display = "none";
      }
      // When the user clicks anywhere outside of the modal, close it
      window.onclick = function(event) {
          if (event.target == modal) {
              modal.style.display = "none";
          }
      }
    } else {
      modal.style.display = 'block';
//      document.forms.form1.elements['entry'].focus();
    }
    return false;

  }
});



FlowRouter.route('/deep-search', {
  name: 'deep-search',
  action: function(params, queryParams){
        console.log('Router::action for: ', FlowRouter.getRouteName());
        console.log(' --- params:',params);
//        document.auteur = "Museum v9";
//        app.article_id.set(undefined);
        BlazeLayout.render('deep-search');
    }
});

TP.events({
  'click .js-clear-search-results': (e,tp)=>{
    tp.data.subIndex_Count.set(0)
    app.subIndex.set([]);
    app.state.set('show-intro',false);
    tp.max_results_reached = tp.find('span.js-max_results_reached')
    tp.max_results_reached.classList.add('nodisplay')
    const inp = tp.find('input.js-deep-search');
    console.log('inp:',inp)
    inp.value = ''
  }
})
