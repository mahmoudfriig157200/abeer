window.onload = () => {
    const isUser = localStorage.getItem('username');
    if(!isUser) {
        window.location.href = "/index.html";
    }
};

// رابط JSONBin لتخزين طلبات السحب
const jsonBinUrl = "https://api.jsonbin.io/v3/b/your-bin-id";  // استبدل بـ Bin ID الخاص بك
const apiKey = "your-api-key";  // يجب استخدام API Key من حسابك في JSONBin

// عند تقديم الفورم
document.getElementById("withdrawalForm").addEventListener("submit", function (e) {
    e.preventDefault(); // منع إرسال الفورم بالطريقة العادية

    const item = document.getElementById("item").value; // العنصر الذي سيتم سحبه
    const email = document.getElementById("email").value.trim(); // البريد الإلكتروني
    const timestamp = new Date().toISOString(); // تاريخ ووقت السحب

    // التحقق من الحقول
    if (email === "") {
        document.getElementById("message").innerHTML = "<div class='alert alert-danger'>يرجى إدخال البريد الإلكتروني.</div>";
        return;
    }

    // إرسال البيانات إلى JSONBin
    fetch(jsonBinUrl, {
        method: "GET",
        headers: {
            "X-Master-Key": apiKey,
            "Content-Type": "application/json"
        }
    })
        .then(response => response.json())
        .then(data => {
            const withdrawalRequests = data.record.withdrawalRequests || [];

            // إضافة طلب السحب الجديد
            const newWithdrawal = {
                item: item,
                email: email,
                timestamp: timestamp
            };
            withdrawalRequests.push(newWithdrawal);

            // حفظ الطلبات المحدثة في JSONBin
            fetch(jsonBinUrl, {
                method: "PUT",  // تأكد من أنك تستخدم PUT لتحديث البيانات
                headers: {
                    "X-Master-Key": apiKey,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ withdrawalRequests })  // التأكد من التنسيق الصحيح للبيانات
            })
                .then(response => {
                    if (response.ok) {
                        return response.json();
                    }
                    throw new Error('فشل في حفظ البيانات');
                })
                .then(data => {
                    document.getElementById("message").innerHTML = "<div class='alert alert-success'>تم تقديم طلب السحب بنجاح.</div>";
                    // يمكنك إعادة توجيه المستخدم أو إظهار إشعار
                })
                .catch(error => {
                    console.error("Error saving withdrawal request:", error);
                    document.getElementById("message").innerHTML = "<div class='alert alert-danger'>حدث خطأ، يرجى المحاولة لاحقًا.</div>";
                });
        })
        .catch(error => {
            console.error("Error fetching data:", error);
            document.getElementById("message").innerHTML = "<div class='alert alert-danger'>حدث خطأ أثناء التحقق من البيانات.</div>";
        });
});