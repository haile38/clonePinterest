function getTimeCreated(startTime) {
    // Tạo một đối tượng Date cho thời gian hiện tại
    const currentTime = new Date();

    // Tạo một đối tượng Date cho thời điểm bạn muốn so sánh(ví dụ: 1 giờ trước)
    startTime = new Date(startTime);

    // Tính khoảng thời gian đã trôi qua bằng cách trừ currentTime cho oneHourAgo
    const timeDifferenceInMilliseconds = currentTime - startTime;
    const timeDifferenceInMinutes = timeDifferenceInMilliseconds / 60000; // 1 phút = 60000 mili giây

    // Kiểm tra khoảng thời gian và hiển thị dựa trên nó
    if (timeDifferenceInMinutes < 1) {
        return 'Vừa xong';
    } else if (timeDifferenceInMinutes < 60) {
        return `${Math.floor(timeDifferenceInMinutes)} phút trước`;
    } else if (timeDifferenceInMinutes < 1440) {
        return `${Math.floor(timeDifferenceInMinutes / 60)} giờ trước`;
    } else {
        return `${Math.floor(timeDifferenceInMinutes / 1440)} ngày trước`;
    }
}

export default getTimeCreated;
