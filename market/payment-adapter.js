(function(){
'use strict';
function account(){var b=window.PLANON_UX_BRIDGE;return b&&b.account?b.account():{uid:'',email:'',loggedIn:false};}
window.PLANON_PAYMENT_ADAPTER={
  mode:'test',
  provider:'planon-test',
  purchase:function(product){
    var a=account();
    if(!a.loggedIn)return Promise.reject(new Error('LOGIN_REQUIRED'));
    return Promise.resolve({id:'test-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,7),productId:product.id,amount:Number(product.price||0),currency:product.currency||'KRW',provider:'planon-test',status:'paid',accountId:a.uid,purchasedAt:Date.now()});
  },
  restore:function(){return Promise.resolve({ok:true,source:'planner-account-state'});}
};
})();