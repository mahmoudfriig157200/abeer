window.onload = () => {
    const isUser = localStorage.getItem('username');
    if (!isUser) {
        window.location.href = "/index.html";
    }
};

//  JSONBin --->
const jsonBinUrl = "https://api.jsonbin.io/v3/b/67536095acd3cb34a8b55615/latest";
const apiKey = "$2a$10$joaUb9c4EH37eI3vNYMO8e8k3x3zDn7V/eGDAZJYfF3iwK9X/tAde";

const username = localStorage.getItem("username");
console.log(username, "done 1");

// عرض اسم المستخدم
const usernameDisplay = document.getElementById("username-display");
if (usernameDisplay) {
    usernameDisplay.textContent = username;
    console.log(username, "done 2");
}


// // تحميل البيانات من JSONbin
// async function loadUserData() {
//     console.log(username, "done 4");
//     console.log(localStorage.getItem("userData"));

//     try {
//         const response = await fetch(jsonBinUrl, {
//             method: "GET",
//             headers: {
//                 "X-Master-Key": apiKey,
//                 "Content-Type": "application/json"
//             }
//         });

//         const data = await response.json();

//         const username = localStorage.getItem("username");
//         console.log("البيانات المسترجعه", data);

//         const userData = data.record.users.find(user => user.username === username);
//         console.log(userData);

//         if (userData) {
//             localStorage.setItem("userData", JSON.stringify(userData));
//             console.log('done');

//             updateBalanceDisplay(userData.points);
//         } else {
//             alert("لا يوجد بيانات للمستخدم. سيتم تسجيل الخروج.");
//         }
//     } catch (error) {
//         console.error("خطأ أثناء تحميل البيانات:", error);
//     }
// }

// // تحديث عرض الرصيد
function updateBalanceDisplay(points) {
    const balanceDisplay = document.getElementById("balance-display");
    const userPoints = localStorage.getItem("userData");
    console.log("done done");

    const parseUserPoints = JSON.parse(userPoints);
    console.log(parseUserPoints.points);


    balanceDisplay.textContent = userPoints.points;
    console.log(localStorage.getItem("userData"));
}

const userPoints = JSON.parse(localStorage.getItem("userData"));
document.addEventListener("DOMContentLoaded", updateBalanceDisplay(userPoints.points))

// // تحديث النقاط في JSONbin
async function updatePointsInJSONbin(newPoints) {
    const userData = JSON.parse(localStorage.getItem("userData"));
    userData.points = newPoints;

    try {
        const response = await fetch(jsonBinUrl.replace('/latest', ''), {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "X-Master-Key": apiKey
            },
            body: JSON.stringify({ [username]: userData })
        });
        const result = await response.json();
        console.log("تم تحديث النقاط في JSONbin:", result);
    } catch (error) {
        console.error("خطأ أثناء تحديث النقاط في JSONbin:", error);
    }
}

// // عند الضغط على صندوق الجواهر
const jewelBox = document.getElementById("jewel-box");
if (jewelBox) {
    jewelBox.addEventListener("click", () => {
        const userData = JSON.parse(localStorage.getItem("userData"));
        const pointsEarned = Math.floor(Math.random() * 10) + 1;

        userData.points += pointsEarned;
        alert(`حصلت على ${pointsEarned} نقطة!`);

        localStorage.setItem("userData", JSON.stringify(userData));
        updateBalanceDisplay(userData.points);

        // تحديث النقاط في JSONbin
        updatePointsInJSONbin(userData.points);
    });
}

// تسجيل الخروج
function logout() {
    localStorage.removeItem("username");
    localStorage.removeItem("userData");
    window.location.href = "/index.html";
}

const logoutBtn = document.getElementById("logout-btn");
logoutBtn.addEventListener("click", logout);


// تحميل بيانات المستخدم عند التحميل
// loadUserData();

// تحديث البيانات بشكل دوري (كل 30 ثانية)
// setInterval(() => {
//     console.log("جلب البيانات من JSONbin...");
//     loadUserData();
// }, 30000); // 30000ms = 30 ثانية
