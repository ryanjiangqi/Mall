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

Route::get('/person', function () {
    return view('web.person');
});

Auth::routes();

Route::get('/home', 'HomeController@index')->name('home');
