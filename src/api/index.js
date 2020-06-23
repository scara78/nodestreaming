const express = require('express');
var request = require('request');
const fetch = require( 'node-fetch');
const router = express.Router();

router.get('/', (req, res) => {
    res.json({
        message: 'NODE JS STREAM BY SERVERS',
        author: 'DARK DEVELOPER',
        urls: [
            {
                'sendvid': '/api/v1/sendvid?code={:code}',
                'clipwatching': '/api/v1/clipwatching?code={:code}',
                'streamtape': '/api/v1/streamtape?code={:code}',
                'dood': '/api/v1/dood?code={:code}',
                'source': '/api/v1/source?code={:url}',
                'solidfiles': '/api/v1/solidfiles?code={:code}',
            }
        ]
    });
});

async function getvideo(server,code){
    let response,data;
    var res,video;
    switch (server) {
        case 'sendvid':
            url = "https://sendvid.com/embed/"+code;
            response = await fetch(url)
            if(response.ok){
                data = await response.text()
                res = data.split('video_source = "');
                res = res[1].split('"');
                video = res[0];
            }
            break;
        case 'mixdrop':
            url = "https://mixdrop.co/e/"+code;
            response = await fetch(url);
            if(response.ok){
                data = await response.text();
                res = data.split('MDCore|');
                res = res[1].split('|poster');
                res = res[0].split('|');
                video = 'http://'+res[0]+'-'+res[1]+'.'+res[4]+'.'+res[5]+'/v/'+res[2]+'.mp4?s='+res[14]+'&e='+res[13];
            }
            break;
        case 'clipwatching':
            url = "https://clipwatching.com/api/file/direct_link?key=65679qlpm31jrq8jiw6ih&file_code="+code;
            response = await fetch(url)
            if(response.ok){
                data = await response.json()
                if(data.result.n){
                    video = data.result.n.url;
                }else{
                    video = data.result.o.url;
                }
            }
            break;
        case 'streamtape':
            url = "https://streamtape.com/e/"+code;
            response = await fetch(url)
            if(response.ok){
                data = await response.text()
                res = data.split('style="display:none;">');
                res = res[1].split('</div>');
                video = 'https:'+res[0]+"&stream=1";
            }
            break;
        case 'dood':
            url = "https://dood.to/d/"+code;
            response = await fetch(url)
            if(response.ok){
                data = await response.text()
                res = data.split('<a href="/');
                res = res[1].split('"');
                res = "https://dood.to/"+res[0]
                response = await fetch(res)
                if(response.ok){
                    data = await response.text()
                    res = data.split("window.open('");
                    res = res[1].split("', '");
                    video = res[0];
                }
            }
            break;
        case 'source':
            video = code;
            break;
        case 'solidfiles':
            url = "http://www.solidfiles.com/v/"+code;
            response = await fetch(url);
            if(response.ok){
                data = await response.text();
                res = data.split('"downloadUrl":"');
                res = res[1].split('"');
                video = res[0];
            }
            break;
            case 'solidfiles':
            url = "http://www.solidfiles.com/v/"+code;
            response = await fetch(url);
            if(response.ok){
                data = await response.text();
                res = data.split('"downloadUrl":"');
                res = res[1].split('"');
                video = res[0];
            }
            break;
        default:
            break;
    }
    return video;
}

router.get('/:server', function(req, res) {
    let url;
    (async function(){
        switch (req.params.server) {
            case 'sendvid':
            case 'mixdrop':
            case 'clipwatching':
            case 'streamtape':
            case 'dood':
            case 'source':
            case 'solidfiles':
                if(req.query.code){
                    url = await getvideo(req.params.server,req.query.code)
                    if(url) {
                        await getvideostream(req,res,url);
                    }else{
                        res.json({
                            msg: 'the code does not work, please check'
                        })
                    }
                }else {
                    res.json({
                        msg: 'the file code is needed in the url'
                    })
                }
                break;
            default:
                res.json({
                    msg: 'this server is not available'
                })
                break;
        }
    })()
});

async function getvideostream(req,res,url){
    fileUrl = url;
    var range = 'undefined' !== typeof req.headers.range ? req.headers.range : 'bytes=0-';
    var positions, start, end, total, chunksize;
    request({
        url: fileUrl,
        method: 'HEAD'
    }, function (error, response, body) {
        if (error) {
            console.log(error)
            res.json({
                msg: 'this server not working'
            })
        } else {
            setResponseHeaders(response.headers);
            pipeToResponse();
        }
    });
    function setResponseHeaders(headers) {
        positions = range.replace(/bytes=/, "").split("-");
        start = parseInt(positions[0], 10);
        total = headers['content-length'];
        end = positions[1] ? parseInt(positions[1], 10) : total - 1;
        chunksize = (end - start) + 1;
        res.writeHead(206, {
            "Content-Range": "bytes " + start + "-" + end + "/" + total,
            "Accept-Ranges": "bytes",
            "Content-Length": chunksize,
            "Content-Type": "video/mp4"
        });
    }
    function pipeToResponse() {
        var options = {
            url: fileUrl,
            headers: {
                range: "bytes=" + start + "-" + end,
                connection: 'keep-alive'
            }
        };
        request(options).pipe(res);
    }
}
module.exports = router;
