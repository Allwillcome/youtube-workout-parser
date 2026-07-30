import { NextRequest, NextResponse } from 'next/server';
import { fetchVideoMetadata, fetchTranscript, extractVideoId } from '@/lib/youtube';
import { stage1Classification, stage2ExtractWorkout } from '@/lib/parser';
import { saveWorkoutPlan } from '@/lib/storage';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { url, apiKey, customSubtitle } = body;

    if (!url || typeof url !== 'string') {
      return NextResponse.json({ error: '请提供有效的 YouTube 视频链接' }, { status: 400 });
    }

    const videoId = extractVideoId(url);
    if (!videoId) {
      return NextResponse.json({ error: '无法解析 YouTube 视频 ID，请检查链接格式' }, { status: 400 });
    }

    // 1. Fetch metadata
    const metadata = await fetchVideoMetadata(url);

    // 2. Fetch transcript (or use custom pasted subtitle)
    let transcriptResult;
    if (customSubtitle && customSubtitle.trim() !== '') {
      transcriptResult = {
        source_type: 'manual' as const,
        language: 'custom',
        segments: [{
          start_seconds: 0,
          end_seconds: metadata.duration_seconds || 300,
          text: customSubtitle
        }]
      };
    } else {
      transcriptResult = await fetchTranscript(videoId);
    }

    // 3. Stage 1: Classification
    const classification = await stage1Classification(metadata, transcriptResult);
    if (!classification.is_actionable) {
      return NextResponse.json({
        stage: 1,
        classification,
        message: '该视频未检测到明确的结构化训练计划信息'
      });
    }

    // 4. Stage 2: Workout Plan Extraction
    const workoutPlan = await stage2ExtractWorkout(metadata, transcriptResult, apiKey);

    // Save initial plan to storage
    saveWorkoutPlan(workoutPlan);

    return NextResponse.json({
      success: true,
      stage: 2,
      classification,
      transcript_source: transcriptResult.source_type,
      plan: workoutPlan
    });

  } catch (error: any) {
    console.error('Parse API error:', error);
    return NextResponse.json({ 
      error: error.message || '视频解析过程发生异常，请重试' 
    }, { status: 500 });
  }
}
