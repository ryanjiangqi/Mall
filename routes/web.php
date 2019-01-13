<?php
Route::get('/', function () {
    return view('web.home');
});
Route::get('/list', function () {
    return view('web.list');
});

Route::get('/detail', function () {
    return view('web.detail');
});

Auth::routes();

Route::get('/home', 'HomeController@index')->name('home');
