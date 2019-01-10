<?php
Route::get('/', function () {
    return view('web.home');
});
Route::get('/list', function () {
    return view('web.list');
});
