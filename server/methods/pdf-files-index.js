import {db, package_id, _assert } from '../cms-api.js';

Meteor.methods({
  'pdf-files-index': ()=>{
    const etime = new Date().getTime()
    return db.query (`
      select
        item_id, revision_id, path, name,
        data->>'h1' as h1,
        data->>'h2' as h2
      from cms.extlinks
      where package_id = $(package_id)
      order by path;
    `, {package_id})
    .then(data =>{
      const _etime = new Date().getTime() - etime;
      console.log(`pdf-file-index => ${data.length} in ${_etime} ms.`)
      return Promise.resolve({
        _etime: _etime,
        rows: data
      })
    })
  }
});
