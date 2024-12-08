window.onload = () => {
    const isUser = JSON.parse(localStorage.getItem('userData'));
    if (isUser.userName) {
        window.location.href = "/dashboard.html";
    }
};

// رابط JSONBin لتخزين المستخدمين
const jsonBinUrl = "https://api.jsonbin.io/v3/b/67536095acd3cb34a8b55615";  // استبدل بـ Bin ID الخاص بك
const apiKey = "$2a$10$joaUb9c4EH37eI3vNYMO8e8k3x3zDn7V/eGDAZJYfF3iwK9X/tAde";  // يجب استخدام API Key من حسابك في JSONBin


// عند تقديم الفورم
document.getElementById("loginForm").addEventListener("submit", function (e) {
    e.preventDefault(); // منع إرسال الفورم بالطريقة العادية
    const userData = {
        userName : document.getElementById("username").value.trim(),
        passWord : document.getElementById("password").value.trim(),
    }

    const username = userData.userName;
    const password = userData.passWord;

    // التحقق من أن الحقول ليست فارغة
    if (username === "" || password === "") {
        document.getElementById("message").innerHTML = "<div class='alert alert-danger'>يرجى إدخال اسم المستخدم وكلمة المرور.</div>";
        return;
    }

    // التحقق من وجود اسم المستخدم وكلمة المرور في قاعدة البيانات
    fetch(jsonBinUrl, {
        method: "GET",
        headers: {
            "X-Master-Key": apiKey,
            "Content-Type": "application/json"
        }
    })
        .then(response => response.json())
        .then(data => {
            const users = data.record.users || [];
            const user = users.find(user => user.username === username && user.password === password);

            if (user) {
                console.log(user);
                const userData = {
                    userName: user.username,
                    passWord: user.password,
                    userPoints: user.points,
                }
                localStorage.setItem("userData", JSON.stringify(userData));
                // إذا كان اسم المستخدم وكلمة المرور صحيحين

                document.getElementById("message").innerHTML =
                    "<div class='alert alert-success'>تم تسجيل الدخول بنجاح.</div>";
                    console.log(JSON.parse(localStorage.getItem("userData")));

                    localStorage.setItem("username", username);
                    localStorage.setItem("userData", JSON.stringify(userData));
                setTimeout(() => {
                    window.location.href = "dashboard.html"; // إعادة التوجيه إلى الصفحة الرئيسية
                }, 2000);
            } else {
                // إذا كانت بيانات الدخول غير صحيحة
                document.getElementById("message").innerHTML = "<div class='alert alert-danger'>اسم المستخدم أو كلمة المرور غير صحيحة.</div>";
            }
        })
        .catch(error => {
            console.error("Error fetching data:", error);
            document.getElementById("message").innerHTML = "<div class='alert alert-danger'>حدث خطأ أثناء التحقق من البيانات.</div>";
        });
});