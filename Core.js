console.log('Hi. I\'m BASU CERT bot');

const TelegramBot = require('node-telegram-bot-api');
const token = '324218849:AAHnDuNgKLig4BiJVZqhhhUlhTvMdnmS1-M';
//const token = '378899707:AAEDJ6ETUAupbMRaJ76VP_8jWHH9fA3O0z8';
const bot = new TelegramBot(token, { polling: true });
console.log('Telegram Servers Status: Connected')

var mongo = require('mongodb');
let ConnectionString = "mongodb://127.0.0.1:27017";

bot.onText(/([\/]?[123456789۱۲۳۴۵۶۷۸۹a-zA-Z\u0621-\u064A\u0660-\u0669\u067E\u0686\u06af\u0698_+\-.,!@#$%^&*();\\\/|<>"']+)\s?([123456789۱۲۳۴۵۶۷۸۹a-zA-Z\u0621-\u064A\u0660-\u0669\u067E\u0686\u06af\u0698_+\-.,!@#$%^&*();\\\/|<>"'])*/, (msg, match) => {
  const chatId = msg.chat.id;

  mongo.connect(ConnectionString, function(err, db){
	db.collection('CV', function(error, collection){
		if (error)
		{
			console.warn(error.message);
		}
		else{
		  switch(match[1])
		  {
        case "/start":
          bot.sendMessage(
            msg.chat.id ,
            'به روبات مرکز تخصصی آپا خوش آمدید\nخدمات این روبات:\n/cv - ارسال رزومه جهت همکاری با مرکز\n/contact - تماس با ما');
          break;

            case "/contact":
              bot.sendMessage(msg.chat.id, 'همدان، چهارباغ شهید مصطفی احمدی روشن، دانشگاه بوعلی سینا، سازمان مرکزی، طبقه دوم، مرکز تخصصی آپا \n تلفن: 38380860-081 \n ایمیل: certbasu@gmail.com \n ' );
              break;

			case "/cv":
				    collection.findOne({ChatId : msg.chat.id}, function (findError, findResult){
  					if(findResult == null){
  						collection.insertOne({ChatId : msg.chat.id ,  Status : 1, ApplyDate : msg.date}, function (colError, result){
						  });
              bot.sendMessage(chatId,"با تشکر از همراهی شما. لطفا نام و نام خانوادگی خود را وارد نمائید:");
			      }
            else {
              var options = {
                    reply_markup: JSON.stringify({
                      inline_keyboard: [
                        [{ text: 'ارسال مجدد رزومه', callback_data: '2' }],
                        [{ text: 'انصراف', callback_data: '1' }],
                      ]
                    })
                  };
              bot.sendMessage(msg.chat.id, "رزومه ی شما پیشتر در سامانه به ثبت رسیده است. دستور بعدی شما:", options);
		        }
				});

				break;
			default:
				collection.findOne({ChatId : msg.chat.id}, function (findError, findResult){
				if(findResult != null)
				{
				  var currentStat = findResult.Status;
				  if (currentStat == 1)
				  {
					collection.update({ChatId : msg.chat.id}, {$set: {Fullname : msg.text.toString("utf8") ,  Status : 2}});
					bot.sendMessage(chatId,"نام و نام خانوادگی شما ثبت شد. لطفا اطلاعات تماس خود را وارد نمائید:");
				  }
				  else if (currentStat == 2)
				  {
					collection.update({ChatId : msg.chat.id}, {$set: {Contact : msg.text.toString("utf8") ,  Status : 3}});
					bot.sendMessage(chatId,"اطلاعات تماس شما ثبت شد. لطفا حوزه های تخصص خود را وارد نمائید:");
				  }
				  else if (currentStat == 3)
				  {
					collection.update({ChatId : msg.chat.id}, {$set: {Expertise : msg.text.toString("utf8") ,  Status : 4}})
					bot.sendMessage(chatId,"حوزه های تخصص شما ثبت شد. لطفا فعالیت های پیشین خود را وارد نمائید:");
				  }
				  else if (currentStat == 4)
				  {
					collection.update({ChatId : msg.chat.id}, {$set: {Experience : msg.text.toString("utf8") ,  Status : 5}})
					bot.sendMessage(chatId,"فعالیت های پیشین شما ثبت شد. لطفا فعالیت های مورد علاقه ی خود در همکاری با ما را ذکر نمائید.");
				  }
				  else if (currentStat == 5)
				  {
					collection.update({ChatId : msg.chat.id}, {$set: {Intrest : msg.text.toString("utf8") ,  Status : 6}})
					bot.sendMessage(chatId,"فعالیت های مورد علاقه ی شما در همکاری با ما ثبت شد.\nممنون از اینکه با ما در ارتباط بودید. پس از بررسی سوابق شما با شما تماس خواهیم گرفت.");
				  }
				}
				  });
			  break;
			}
  }
});
});
});



bot.on('callback_query', function onCallbackQuery(callbackQuery) {
  const action = callbackQuery.data;
  const msg = callbackQuery.message;
  const opts = {
    chat_id: msg.chat.id,
    message_id: msg.message_id,
  };
  let text;

  if (action === '1') {
    text = 'اطلاعات پیشین شما در سامانه به ثبت رسیده و تغییری نکرده است.';
  }
  else if (action === '2'){
    text=  'شما میتوانید رزومه ی خود را برای ما ارسال نمائید. /cv';
    mongo.connect(ConnectionString, function(err, db){
    db.collection('CV', function(error, collection){
    collection.findOne({ChatId : msg.chat.id}, function (findError, findResult){
    if(findResult != null)
    {
      collection.update({ChatId : msg.chat.id}, {$set: {ChatId : findResult.ChatId * -1 }});
      text ="با تشکر از شما. لطفا مجددا رزومه ی خود را ارسال نمائید. /cv";
    }
  });});});
  }
  else{
    text = 'این درخواست تعریف نشده است';
  }
  bot.editMessageText(text, opts);
});

/*
bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, 'Received your message');
});
*/
