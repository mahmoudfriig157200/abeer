window.onload = () => {
    const isUser = JSON.parse(localStorage.getItem('userData'));
    if (isUser.userName) {
        window.location.href = "/dashboard.html";
    }
};

//  JSONBin --->
const jsonBinUrl = "https://api.jsonbin.io/v3/b/67536095acd3cb34a8b55615";
const apiKey = "$2a$10$joaUb9c4EH37eI3vNYMO8e8k3x3zDn7V/eGDAZJYfF3iwK9X/tAde";

// Send Sign Up data --->
document.getElementById("registerForm").addEventListener("submit",
    function (e) {
        e.preventDefault(); // No referesh
        const userData = {
            userName: document.getElementById("username").value.trim(),
            passWord: document.getElementById("password").value.trim(),
            userPoints: 0
        }
        const username = userData.userName;
        const password = userData.passWord;
        const points = userData.userPoints;

        // Passowrd validation 8 chr length
        if (password.length < 8) {
            document.getElementById("message").innerHTML =
                "<div class='alert alert-danger'>يجب أن تكون كلمة المرور مكونة من 8 أحرف على الأقل.</div>";
            return;
        }

        // Username validation Requist if it in json
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
                const userExists = users.find(user => user.username === username);

                if (userExists) {
                    // إذا كان اسم المستخدم مسجلًا مسبقًا
                    document.getElementById("message").innerHTML =
                        "<div class='alert alert-danger'>اسم المستخدم مسجل بالفعل.</div>";
                } else {
                    // إذا لم يكن اسم المستخدم مسجلًا، نقوم بإضافة المستخدم
                    const newUser = {
                        username,
                        password,
                        points,
                        withdrawalRequests: []
                    };
                    users.push(...[], newUser);

                    // حفظ المستخدم الجديد في JSONBin
                    fetch(jsonBinUrl, {
                        method: "PUT",  // تأكد من أنك تستخدم PUT لتحديث البيانات
                        headers: {
                            "X-Master-Key": apiKey,
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({ users })  // تأكد من أن البيانات في التنسيق الصحيح
                    })
                        .then(response => {
                            if (response.ok) {
                                return response.json();
                            }
                            throw new Error('فشل في حفظ البيانات');
                        })
                        .then(data => {
                            document.getElementById("message").innerHTML =
                                "<div class='alert alert-success'>تم التسجيل بنجاح.</div>";
                            localStorage.setItem("userData", JSON.stringify(userData));
                            localStorage.setItem("username", username);
                            setTimeout(() => {
                                window.location.href = "dashboard.html"; // إعادة التوجيه إلى صفحة تسجيل الدخول
                            }, 2000);
                        }).catch(error => {
                            console.error("Error saving user:", error);
                            document.getElementById("message").innerHTML = "<div class='alert alert-danger'>حدث خطأ، يرجى المحاولة لاحقًا.</div>";
                        });
                }
            }).catch(error => {
                console.error("Error fetching data:", error);
                document.getElementById("message").innerHTML = "<div class='alert alert-danger'>حدث خطأ في التحقق من البيانات.</div>";
            });
    });