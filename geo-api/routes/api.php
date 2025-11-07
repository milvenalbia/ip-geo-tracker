<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\SearchHistoryController;
use Illuminate\Support\Facades\Route;

Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'user']);

    // Search History Routes
    Route::get('/search-history', [SearchHistoryController::class, 'index']);
    Route::post('/search-history', [SearchHistoryController::class, 'store']);
    Route::delete('/search-history', [SearchHistoryController::class, 'deleteMultiple']);
});
