var swiperMissionStore = new Swiper(".store-list .list", {
    slidesPerView: 3,
    grid: {
        rows: 2,
    },
    spaceBetween: 14,
    pagination: {
        el: ".store-pagination",
        clickable: true,
        renderBullet: function (index, className) {
            return '<span class="' + className + '">' + (index + 1) + "</span>";
        },
    },
});

var swiperMissions = new Swiper(".mission-list .list", {
    direction: "vertical",
    slidesPerView: 4,
    slidesPerGroup: 4,
    spaceBetween: 10,
    pagination: {
        el: ".mission-pagination",
        clickable: true,
        renderBullet: function (index, className) {
            return '<span class="' + className + '">' + (index + 1) + "</span>";
        },
    },
});
