<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class UserPreferenceController extends Controller
{
    public function update(Request $request)
    {
        $request->validate([
            'theme' => 'required|in:light,dark'
        ]);

        // Creamos la cookie por 1 año (525600 minutos)
        $cookie = cookie('user_theme', $request->theme, 525600);

        return response()->json([
            'message' => 'Preferencia guardada',
            'theme' => $request->theme
        ])->withCookie($cookie);
    }
}
