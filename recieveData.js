var handleTheData = (data) =>{
  console.log("Recieve data file :3 ----------------");
  console.log(typeof data);
  var number = Number(data)
  console.log(typeof number);
  console.log(number);
}

module.exports.handleTheData = handleTheData;
