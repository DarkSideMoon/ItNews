// ==============================================
// 		      Model class for event
// ==============================================
'use strict';

let that;
let event = {
    newsSource: '',
    title: '',
    href: '',
    time: '',
    imageSource: '',
    price: '',
    place: '',
    text: '',
    comments: 0,
};

function Event(newsSource, title, href, time, imageSource, price, place, text, comments) {
    this.event.newsSource = newsSource;
    this.event.title = title;
    this.event.href = href;
    this.event.time = time;
    this.event.imageSource = imageSource;
    this.event.price = price;
    this.event.place = place;
    this.event.text = text;
    this.event.comments = comments;
    that = this;

    that.getEventInfo = () => {
        return this.event.title +
        '\nTime: ' + this.event.time + 
        '\nPrice: ' + this.event.price + 
        '\nPlace: ' + this.event.place + 
        '\nText: ' + this.event.text;
    }

    that.getEvent = () => {
        return this.event;
    }
}