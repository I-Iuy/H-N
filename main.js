import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js';
import { getFirestore, collection, addDoc, getDocs, query, orderBy } from 'https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDeOes-U5To416C-FgGMAFt-gVMz-fyOss",
  authDomain: "hnhn-3361d.firebaseapp.com",
  databaseURL: "https://hnhn-3361d-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "hnhn-3361d",
  storageBucket: "hnhn-3361d.firebasestorage.app",
  messagingSenderId: "99009713629",
  appId: "1:99009713629:web:1b13c83e3c9e731eeb9234",
  measurementId: "G-228BFGZQ3N"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Kiểm tra dữ liệu nhập vào
function validateInput(name, wish) {
  let isValid = true;

  // Reset thông báo lỗi
  $('#name-error').text('');
  $('#wish-error').text('');

  // Kiểm tra tên
  if (!name || name.trim() === "") {
    $('#name-error').text('Tên không được để trống.');
    isValid = false;
  } else if (name.length > 20) {
    $('#name-error').text('Tên không được vượt quá 20 ký tự.');
    isValid = false;
  }

  // Kiểm tra lời chúc
  if (!wish || wish.trim() === "") {
    $('#wish-error').text('Lời chúc không được để trống.');
    isValid = false;
  } else if (wish.length > 50) {
    $('#wish-error').text('Lời chúc không được vượt quá 50 ký tự.');
    isValid = false;
  }

  return isValid;
}

// Hiển thị thông báo lỗi
function showErrorToast(message) {
  const toastHTML = `
    <div class="toast align-items-center text-bg-danger border-0" role="alert" aria-live="assertive" aria-atomic="true">
      <div class="d-flex">
        <div class="toast-body">
          ${message}
        </div>
        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
      </div>
    </div>
  `;
  $('#toast-container').append(toastHTML);
  const toast = new bootstrap.Toast($('.toast:last')[0]);
  toast.show();
}

// Tải danh sách lời chúc từ Firestore
async function loadWishes() {
  $('#wish-list').empty(); // Xóa danh sách cũ

  const q = query(collection(db, "wishes"), orderBy("timestamp", "desc"));
  const querySnapshot = await getDocs(q);
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    $('#wish-list').append(`
      <div class="list-group-item" style=" box-shadow: 0 4px 8px rgba(255, 160, 122, 0.1);">
        <h5 class="mb-1">${data.name}</h5>
        <p class="mb-1">${data.wish}</p>
      </div>
    `);
  });
}

// Tải lời chúc khi trang web được tải
$(document).ready(function () {
  loadWishes();
});

// Đồng hồ đếm thời gian
$(document).ready(function () {
  // Thiết lập thời gian đếm ngược đến 12:00 trưa ngày 26/11/2024
  const eventTime = new Date("2024-11-26T12:00:00").getTime();

  function updateTimer() {
    const currentTime = new Date().getTime();
    const timeDifference = eventTime - currentTime;

    if (timeDifference >= 0) {
      const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

      $("#days").text(days < 10 ? "0" + days : days);
      $("#hours").text(hours < 10 ? "0" + hours : hours);
      $("#minutes").text(minutes < 10 ? "0" + minutes : minutes);
      $("#seconds").text(seconds < 10 ? "0" + seconds : seconds);
    } else {
      $(".timer").html("<h3>Sự kiện đã đến!</h3>");
    }
  }

  // Cập nhật đồng hồ mỗi giây
  setInterval(updateTimer, 1000);
});

/* Hiển thị lịch */
$(document).ready(function () {
  // Khởi tạo Datepicker
  $("#datepicker").datepicker({
    defaultDate: new Date(2024, 10, 25), // Ngày mặc định (tháng trong JS tính từ 0)
    beforeShowDay: function (date) {
      // Đánh dấu ngày 25
      const day = date.getDate();
      const month = date.getMonth();
      const year = date.getFullYear();
      if (day === 25 && month === 10 && year === 2024) {
        return [true, "highlight-day", "Ngày đặc biệt"];
      }
      return [true, "", ""];
    }
  });

  // Hiển thị lịch khi nhấn vào nút
  $("#calendar-icon").on("click", function (e) {
    e.preventDefault();
    const $datepicker = $("#datepicker");
    if ($datepicker.is(":visible")) {
      $datepicker.hide(); // Ẩn lịch nếu đang hiển thị
    } else {
      $datepicker.show(); // Hiển thị lịch
    }
  });

  // Ẩn lịch khi nhấn ngoài
  $(document).on("click", function (e) {
    if (!$(e.target).closest("#calendar-icon, #datepicker").length) {
      $("#datepicker").hide();
    }
  });
});
//In thông báo cho index
$(document).ready(function () {
  // Hiển thị số ký tự còn lại
  $('#name').on('input', function () {
    const remaining = 20 - $(this).val().length;
    $('#name-count').text(`Còn lại: ${remaining} ký tự`);
  });

  $('#wish').on('input', function () {
    const remaining = 50 - $(this).val().length;
    $('#wish-count').text(`Còn lại: ${remaining} ký tự`);
  });
});
$('#wish-form').on('submit', async function (event) {
  event.preventDefault();
  const name = $('#name').val();
  const wish = $('#wish').val();

  // Kiểm tra dữ liệu nhập
  if (validateInput(name, wish)) {
    try {
      await addDoc(collection(db, "wishes"), {
        name: name,
        wish: wish,
        timestamp: new Date()
      });

      // Thông báo thành công
      Swal.fire({
        title: 'Lời chúc đã được gửi!',
        text: 'Cảm ơn bạn đã gửi lời chúc đến H&N ❤️',
        icon: 'success',
        confirmButtonText: 'OK',
        timer: 3000, // Tự động tắt sau 3 giây
        timerProgressBar: true
      });

      // Reset form và xóa thông báo lỗi
      $('#name').val('');
      $('#wish').val('');
      $('#name-error').text('');
      $('#wish-error').text('');

      // Tải lại danh sách lời chúc
      loadWishes();
    } catch (e) {
      Swal.fire({
        title: 'Lỗi!',
        text: 'Đã xảy ra lỗi khi gửi lời chúc. Vui lòng thử lại!',
        icon: 'error',
        confirmButtonText: 'OK'
      });
      console.error("Lỗi khi gửi lời chúc: ", e);
    }
  }
});
ocument.addEventListener('DOMContentLoaded', () => {
  const music = document.getElementById('background-music');

  // Kiểm tra trạng thái từ localStorage
  if (localStorage.getItem('isPlaying') === 'true') {
      music.play().catch(() => {
          // Nếu có lỗi, đợi người dùng tương tác
          setupEventListeners();
      });
  } else {
      setupEventListeners();
  }

  // Hàm phát nhạc khi có bất kỳ hành động tương tác
  function setupEventListeners() {
      const playMusic = () => {
          music.play();
          localStorage.setItem('isPlaying', 'true'); // Lưu trạng thái phát nhạc
          removeEventListeners();
      };

      document.addEventListener('scroll', playMusic);
      document.addEventListener('click', playMusic);
      document.addEventListener('mousemove', playMusic);
      document.addEventListener('touchstart', playMusic);
  }

  // Hàm xóa các sự kiện sau khi nhạc được phát
  function removeEventListeners() {
      document.removeEventListener('scroll', playMusic);
      document.removeEventListener('click', playMusic);
      document.removeEventListener('mousemove', playMusic);
      document.removeEventListener('touchstart', playMusic);
  }

  // Khi người dùng thoát hoặc làm mới trang
  window.addEventListener('beforeunload', () => {
      if (!music.paused) {
          localStorage.setItem('isPlaying', 'true'); // Giữ trạng thái nếu nhạc đang phát
      } else {
          localStorage.setItem('isPlaying', 'false');
      }
  });
});