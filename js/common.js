$(document).ready(function() {
    $("#to-title:not(.btn-selected)").click(function() {
        location.href = "index.html";
    });
    $("#to-profile:not(.btn-selected)").click(function() {
        location.href = "profile.html";
    });
    $("#to-piece:not(.btn-selected)").click(function() {
        location.href = "piece.html";
    });
});