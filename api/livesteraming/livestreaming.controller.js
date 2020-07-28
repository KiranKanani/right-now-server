import axios from 'axios'
import {liveSchema} from'./livestreaming.modal'
export const createLiveStream = async(req,res) =>{
    try{
        const {steamName,requestId} = req.body
        const activeUser = await liveSchema.find({});
        var flag = true;
        activeUser.map(item =>{
            if(item.requestId === requestId){
                flag=false;
            }
        })
        if(!flag){
            return res.status(401).send({
                success:false,
                message:"user already active with other stream"
            })
        }
        const data = {
            "live_stream": {
                "name": steamName,
                "transcoder_type": "transcoded",
                "billing_mode": "pay_as_you_go",
                "broadcast_location": "us_west_california",
                "encoder": "other_rtmp",
                "delivery_method": "push",
                "aspect_ratio_width": 1920,
                "aspect_ratio_height": 1080,
              }
        }
        const options = {
            headers: {
                'wsc-api-key':'KkvvufvVDXZ9UMjhYxLQpaXNu67VJ9A0zp4b03yONzIdWQE2PHUv2dEUixfm3433',
                'wsc-access-key': '9s4mq7dUGJFPUInHFK8YM4hpywxRBpr4w3cvC9CUYjWY0LGhg5X3YOU6g0gN3209',
                'Content-Type': 'application/json'
            }
          };
        const response = await axios.post("https://api.cloud.wowza.com/api/v1.5/live_streams",data,options)
        if(response.data.live_stream){
            liveSchema.create({
                userId:steamName,
                requestId:'sd12312fd',
                streamId:response.data.live_stream.id
            })
        }
        console.log(response.data)
        res.status(201).send({
            success:true,
            streamDetails:response.data
        })
    }
    catch(err){
        res.status(401).send({
            success:false,
            message:err.message
        })
    }
}

export const deleteLiveStream = async(req,res) =>{
    try{

        const {id} = req.body
        const options = {
            headers: {
                'wsc-api-key':'KkvvufvVDXZ9UMjhYxLQpaXNu67VJ9A0zp4b03yONzIdWQE2PHUv2dEUixfm3433',
                'wsc-access-key': '9s4mq7dUGJFPUInHFK8YM4hpywxRBpr4w3cvC9CUYjWY0LGhg5X3YOU6g0gN3209',
                'Content-Type': 'application/json'
            }
          };
        const response = await axios.delete("https://api.cloud.wowza.com/api/v1.5/live_streams/"+id,options)
        console.log(response.data)
        res.status(201).send({
            success:true,
            streamDetails:response.data
        })
        await liveSchema.remove({streamId:id})
    }
    catch(err){
        res.status(401).send({
            success:false,
            message:err.message
        })
    }
}
export const fetchLiveSteam = async(req,res) =>{
    try{
        const {id} = req.body
        const options = {
            headers: {
                'wsc-api-key':'KkvvufvVDXZ9UMjhYxLQpaXNu67VJ9A0zp4b03yONzIdWQE2PHUv2dEUixfm3433',
                'wsc-access-key': '9s4mq7dUGJFPUInHFK8YM4hpywxRBpr4w3cvC9CUYjWY0LGhg5X3YOU6g0gN3209',
                'Content-Type': 'application/json'
            }
          };
        const response = await axios.get("https://api.cloud.wowza.com/api/v1.5/live_streams/"+id,options)
        console.log(response.data)
        res.status(201).send({
            success:true,
            streamDetails:response.data
        })
    }
    catch(err){
        res.status(401).send({
            success:false,
            message:err.message
        })
    }
}

//start live streaming

export const startLiveSteam = async(req,res) =>{
    try{
        const {id} = req.body
        const headers = {
                'wsc-api-key':'KkvvufvVDXZ9UMjhYxLQpaXNu67VJ9A0zp4b03yONzIdWQE2PHUv2dEUixfm3433',
                'wsc-access-key': '9s4mq7dUGJFPUInHFK8YM4hpywxRBpr4w3cvC9CUYjWY0LGhg5X3YOU6g0gN3209',
                'Content-Type': 'application/json'
            }
          //console.log(id)
        axios('https://api.cloud.wowza.com/api/v1.5/live_streams/'+id+'/start',{ method: 'PUT', headers: headers})
        .then(response =>{
            return res.status(201).send({
                success:true,
                streamDetails:response.data
            })
        })
        .catch(err=>{
            return res.status(401).send({
                success:false,
                message:err.message
            })
        })
    }
    catch(err){
        res.status(401).send({
            success:false,
            message:err.message
        })
    }
}

//stop liveStreaming

export const stopLiveStream = async(req,res) =>{
    try{
        const {id} = req.body
        const headers = {
            'wsc-api-key':'KkvvufvVDXZ9UMjhYxLQpaXNu67VJ9A0zp4b03yONzIdWQE2PHUv2dEUixfm3433',
            'wsc-access-key': '9s4mq7dUGJFPUInHFK8YM4hpywxRBpr4w3cvC9CUYjWY0LGhg5X3YOU6g0gN3209',
            'Content-Type': 'application/json'
        }
        const response = await axios('https://api.cloud.wowza.com/api/v1.5/live_streams/'+id+'/stop',{ method: 'PUT', headers: headers})
        console.log(response.data);
        return res.status(201).send({
            success:true,
            message:response.data
        })
    }
    catch(err){
        res.status(401).send({
            success:false,
            message:err.message
        })
    }
}