import bot from "../../create-bot";

bot.command("help", async (ctx) => {
  await ctx.reply(
    `توجه کنین که در این مرحله نیاز به لپتاپ یا کامپیوتر دارین و باقی قسمت های ربات بدون نیاز به لپتاپه (اگه رایانه و لپتاپ ندارین می تونین از یکی از دوستانتون برای انجام این مرحله کمک بگیرین).

    برای معرفی برنامه هفتگی خودتون به ربات به ترتیب این کار ها رو انجام بدین:
    ۱- دستور /set رو اجرا کنین.
    ۲- با کامپیوتر یا لپتاپ وارد سایت گلستان بشین.
    ۳- گزارش ۸۸ یا ۷۸ (هر کدوم که در دسترسه) رو بیارین بالا.
    ۴- کلید F12 رو از روی صفحه کلید بزنین (یک نکته بگم:‌ اگه از این لپتاپ جدیدا دارین ممکنه کلید F12 رو بزنین و هیچ صفحه ای براتون باز نشه. در این صورت کلید Fn رو نگه دارین و کلید F12 رو بزنین تا کار کنه).
    ۵- حالا توی پنجره باز شده داخل مرورگر روی قسمت console کلیک کنین.
    ۶- کدی که در پیام بعدی براتون ارسال کردم رو اونجا paste کنین و کلید Enter رو بزنین.
    ۷- یک متن انگلیسی عجیب و غریب روی صفحه تون میاد که حاوی برنامه هفتگیتون یا به اصطلاح توکن گلستانه. این رو کپی کنین و برای ربات بفرستین.`
  );

  await ctx.reply(
    `\`const string=JSON.stringify([...[...document.querySelectorAll("iframe")].filter(e=>e.src.match(".*fid=.*;(88|78).*"))[0].contentDocument.querySelector("[name=Master]").contentDocument.querySelector("[name=Header]").contentWindow.Form_Body.contentWindow.Table3.children[0].children,].map(e=>[...e.children].map(e=>e.textContent)).map(e=>({name:e[1],teacher:e[3],days:[e[4],e[5],e[6],e[7],e[8]].map(e=>{if(""===e)return null;let t=e.substr(0,11),n=e.substr(11).trim(),r,o;return n.startsWith("ف ")?(o="odd",r=n.substr(2)):n.startsWith("ز ")?(o="even",r=n.substr(2)):(o=null,r=n),{location:r,time:t,evenOdd:o}})}))),codeUnits=new Uint16Array(string.length);for(let i=0;i<codeUnits.length;i++)codeUnits[i]=string.charCodeAt(i);console.log(btoa(String.fromCharCode(...new Uint8Array(codeUnits.buffer))));\``,
    {
      parse_mode: "Markdown",
    }
  );
});
