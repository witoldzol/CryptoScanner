
let async = require('async')

let cl = x=>console.log(x)

let delay = (time, value)=>
{
	return new Promise( resolve=>setTimeout( resolve.bind(null, value), time))
}

let innerPromise = (data)=>{
	return new Promise( (resolve,reject)=>{

		if(data){
			//it returns
			resolve( data * 2 )
			//you can still execute stuff
		}
		else
		{
			//this will get output on rejection ( as well as .catch part)
			reject( 'promise rejected ')
		}
	})
}

let outerPromise = async (val)=>
{
	return new Promise( (resolve,reject)=>
	{
		let tries = 1
		let attempt = (n)=>
		{
			return innerPromise(val).then(res=>resolve(res)).catch(e=>
			{
				if(n<3)
				{
					cl('retry')                   
					delay( 1000, '' ).then( ()=>attempt(n+1))
				}  
				else
				{
					return reject(e)
				}
			})
		}
		attempt(1)
	})
		.then(res=>res)
		.catch(e=>e)
}

let arr = [1,2,3,null, 5]
// async function multi(x){return x*3}
async.map(arr,outerPromise, (err,results)=>{
	// if(err) throw err
	cl('resu from async map ' + results)
	// if(res)arr.push(res)
})

 