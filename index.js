
String.prototype.indexOfAll = function(regex){
  var regx =  new RegExp(/<[^\/]|(<\/)/g);
  var index = [];
  var match;
  while( match = regx.exec(this))
    index.push(match.index);

  return index.length?index:null
}

Array.prototype['>'] = function (value) {
  return compareArray(this,'>',value);
};

Array.prototype['='] = function (value) {
  return compareArray(this,'=',value);
}

Array.prototype['>='] = function (value) {
  return compareArray(this,'>=',value);
}
Array.prototype['<='] = function (value) {
  return compareArray(this,'<=',value);
}
Array.prototype['<'] = function (value) {
  return compareArray(this,'<',value);
};


Array.prototype['*'] = function (value) {


  if(Array.isArray(value) && this.isConsistent() && value.isConsistent()){
    tvalue = value.transpose();
    // console.log(tvalue.toString())
    ti = this.size(1);
    tj = this.size(2); // assuming that all subarrays have the same size;
    // console.log(`this: i:${ti} j:${tj}`);
    vi = value.size(1);
    vj = value.size(2); // assuming that all subarrays have the same size;
    // console.log(`value: i:${vi} j:${vj}`);
    var arr = Array.zeros(ti,vj);
    // console.log(arr.toString());
    if(tj==vi){
      if(ti==1){
        if(vj==1){
          s = this['.*'](tvalue).sum();
        } else {
          var a = this;
            tvalue.forEach(function(v,j){
            arr[j] = a['.*'](v).sum();
          });
        }
      }else{
        if(vj==1){
          this.forEach(function(val,idx){
            arr[idx][0] = val['.*'](tvalue).sum();
          });
        }else{
          this.forEach(function(val,idx){
            tvalue.forEach(function(v,id){
              arr[idx][id] = val['.*'](v).sum();
              // console.log(val);
              // console.log(v);
              // console.log(arr[idx][id]);
            })
          });
        }

      }

    }else {
      console.log(  '\n----------------------------------------------------------------')
      console.error('This number of columns does not patch with provided array lines.\nIs not possible to multiply these two matrixes.');
      console.log(  '----------------------------------------------------------------\n')
    }
  }else{
    console.error(`Provided value must be an consistent Array.\nsee: Array.prototype.isConsistent`);
    return undefined;
  }
  return arr;
};

Array.prototype['+'] = function (value) {
  return compareArray(this,'+',value);
};

Array.prototype['-'] = function (value) {
  return compareArray(this,'-',value);
};

Array.prototype['.*'] = function (value) {
  return compareArray(this,'.*',value);
};

Array.prototype.transpose = function (force) {
  li = this.size(1);
  lj = this.size(2); // assuming that all subarrays have the same size;
  var arr = Array.zeros(lj,li);

  // console.log(li);
  // console.log(lj);
  if(li > 1){
    if(lj>1){
      for(i = 0;i<li;i++){
        for(j = 0;j<lj;j++){
          arr[j][i] = this[i][j];
        }
      }
    }else{
      for(i = 0;i<li;i++){
        for(j = 0;j<lj;j++){
          arr[i] = this[i][0];
        }
      }
    }


  }else{
    this.forEach((v,i)=>arr[i][0]=v);
  }
  return arr;
};


Array.prototype.sum = function () {
   return this.reduce((a,b,c)=>{ return a+b; });
};

Array.prototype.diff = function(){
  arr = [];
  this.reduce((a,b,c)=>{ arr.push(a-b); return b;});
  return arr;
}

Array.prototype.dist = function(){
  arr = [];
  this.reduce((a,b,c)=>{ arr.push(a<b?b-a:a-b); return b;});
  return arr;
}

Array.prototype.max = function(){
  return this.reduce((a,b,c)=>{ return a>b?a:b; });
}

Array.prototype.min = function(){
  return this.reduce((a,b,c)=>{ return a<b?a:b; });
}

Array.prototype.avg = function(){
  return this.sum()/this.length;
}

Array.prototype.abs = function () {
  var arr = [];
  this.forEach((val)=>{ arr.push(Math.abs(val));});
  return arr;
};

Array.prototype.isNumeric = function(each_value){
  var arr = [];
  if(!each_value || each_value===undefined){
   // return arr.sum()==this.length;
   return this.every((val)=>{isNumeric(val)})?1:0;
  }else{
    this.forEach((val)=>{ arr.push(isNumeric(val)?1:0);});
    return arr;
  }

}

Array.prototype.size = function (param) {
  if(this.isConsistent()==0){
    console.warn('This multidimentional Array is not consistent;\nThe returned value is based on first line only.');
  }

  var sz;
  if(Array.isArray(this[0])){
    sz = [this.length,this[0].length]
  }else{
    sz = [1, this.length];
  }


  if(param==undefined || param == 0){
    return sz;
  }else if(param == 1){
    return sz[0];
  }else if (param == 2) {
    return sz[1];
  }
};

Array.prototype.isConsistent = function () {
  if(Array.isArray(this[0])){
    return this.every(value=>this[0].length==value.length)?1:0;
  }
  return 1;
};
Array.prototype.clone = function () {
  return this.slice(0);
};

Array.prototype.toString = function(){
  try{
    sz = this.size();

  if(sz[0]>1){
    str = '';
    this.forEach(function(val,idx){
      str += '| '
      val.forEach(function(v2,id2){

        if(id2<(sz[1]-1)){
          str += v2;
          str += ','

        }else if(id2==(sz[1]-1)){
          str += v2;
          str += ' |\n';
        }
      });
    })
  }else{
    str = '[';
    this.forEach(function (val,idx){
      str += val;


      if(idx<(sz[1]-1)){
        str += ', '
      }else{
        str += ']';
      }
    });

  }
  return str;
  }catch(err){
      console.error(err);
      console.log(this);
  }
}

Array.zeros = function(i,j) {
  return Array.create(i,j,0);
}

Array.ones = function(i,j) {
  return Array.create(i,j,1);
}

Array.create = function(i,j,val) {
  // console.log(`${val} ${i} ${j}`)
  var arr = [];
  if(i==1){
    for(xj=0;xj<j;xj++){
      arr[xj] = val;
    }
  }else{
    var columns = Array.create(1,j,val);

    for(xi = 0;xi<i;xi++){
      arr[xi] = columns.clone();
      // console.log(arr[xi]);
    }
  }
  return arr;
}



function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

function compareArray(a1, comp , a2){
  var arr = [];
  a1sz = a1.size();
  a2sz = a2.size();



  if(Array.isArray(a1) && a1.size().sum()>2 && a1sz[1]==a2sz[1] && a1sz[0]==a1sz[0]){
    a1.forEach((v,idx)=>{
      if(Array.isArray(v)){
        if(Array.isArray(a2)){
          arr.push(v[comp](a2[idx]));
        }else{
          arr.push(v[comp](a2));
        }
      }else{
        if(Array.isArray(a2)){
          arr.push(compare[comp](v,a2[idx]));
        }else{
          arr.push(compare[comp](v,a2));
        }
      }
    });
  }else {
    if(Array.isArray(a1)){
      if(a1sz[0]>0 && a1sz[1]==1){
        a2.forEach((v2,idx)=>{
          arr.push(a1[0]*v2);
        });
      }else {
        console.warn('could not multiply these two values.');
        return 0;
      }
    }else{
      a2.forEach((v2,idx)=>{
        arr.push(a1*v2);
      });
    }
  }

  return arr;
}
var compare = {};
compare['+'] = (a1,a2)=>{return a1+a2;}
compare['-'] = (a1,a2)=>{return a1-a2;}
compare['.*'] = (a1,a2)=>{return a1*a2;}
compare['='] = (a1,a2)=>{return a1==a2?1:0;}
compare['>'] = (a1,a2)=>{return a1>a2?1:0;}
compare['>='] = (a1,a2)=>{return a1>=a2?1:0;}
compare['<'] = (a1,a2)=>{return a1<a2?1:0;}
compare['<='] = (a1,a2)=>{return a1<=a2?1:0;}
