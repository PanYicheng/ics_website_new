var Carousel = require('../../models/carousel');

exports.get = function(req, done, fail){
    done({
       // carousels: Carousel.random(8)

        carousels:[

            {title: '北京航空航天大学伍前红教授来访并做学术报告',
            content: '',
            createdTime: Date.now(),
            img: '/img/home/北京航空航天大学伍前红教授来访并做学术报告.jpg'},

            {title: '2017年度中国计算机学会颁奖大会',
            content: '',
            createdTime: Date.now(),
            img: '/img/home/2017CCF颁奖大会.jpg'},

            {title: '2017年终总结会议',
            content: '',
            createdTime: Date.now(),
            img: '/img/home/2017年终总结大会.jpg'},

            {title: '德克萨斯大学达拉斯分校林志强教授来访实验室',
            content: '',
            createdTime: Date.now(),
            img: '/img/home/德克萨斯大学达拉斯分校林志强教授来访实验室.jpeg'},         

            {title: '美国宾州州立大学Chao-hsien Chu教授学术讲座',
            content: '',
            createdTime: Date.now(),
            img: '/img/home/美国宾州州立大学Chao-hsien Chu教授学术讲座.jpeg'},

        ]
    });
};

