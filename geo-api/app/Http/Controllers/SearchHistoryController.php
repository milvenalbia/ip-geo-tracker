<?php

namespace App\Http\Controllers;

use App\Models\SearchHistory;
use Illuminate\Http\Request;

class SearchHistoryController extends Controller
{
    public function index(Request $request)
    {
        $histories = SearchHistory::where('user_id', $request->user()->id)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($histories);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'ip' => 'required|ip',
            'city' => 'nullable|string',
            'region' => 'nullable|string',
            'country' => 'nullable|string',
            'loc' => 'nullable|string',
            'org' => 'nullable|string',
            'postal' => 'nullable|string',
            'timezone' => 'nullable|string',
        ]);

        $history = SearchHistory::updateOrCreate(
            [
                'user_id' => $request->user()->id,
                'ip' => $validated['ip'],
            ],
            $validated
        );

        return response()->json($history, 201);
    }

    public function deleteMultiple(Request $request)
    {
        $validated = $request->validate([
            'ips' => 'required|array',
            'ips.*' => 'required|string',
        ]);

        SearchHistory::where('user_id', $request->user()->id)
            ->whereIn('ip', $validated['ips'])
            ->delete();

        return response()->json(['message' => 'History deleted successfully']);
    }
}
