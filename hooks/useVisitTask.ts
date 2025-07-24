'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import confetti from 'canvas-confetti';
import toast from 'react-hot-toast';

export function useVisitTask() {
  const [overlay, setOverlay] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const visitTask = async (task: { campaign_id: string; url: string }) => {
    let safeUrl = task.url;
    if (!/^https?:\/\//i.test(safeUrl)) {
      safeUrl = 'https://' + safeUrl;
    }

    setOverlay(true);
    setCountdown(10);
    document.title = `⏳ 10s - FocusPay`;

    const taskWindow = window.open(safeUrl, '_blank');

    if (!taskWindow) {
      toast.error('⚠️ Failed to open new tab. Please allow popups for this site.');
      setOverlay(false);
      return;
    }

    // taskWindow.focus();

    let seconds = 10;

    const countdownInterval = setInterval(() => {
      seconds--;
      setCountdown(seconds);
      document.title = `⏳ ${seconds}s - FocusPay`;

      if (seconds <= 0) {
        clearInterval(countdownInterval);

        document.title = '✅ Task Completed - FocusPay';
        markTaskAsViewed(task.campaign_id);
        try {
          taskWindow.focus();
          taskWindow.close();
        } catch (err) {
          console.warn('Could not close tab:', err);
        }

        // 🎉 Confetti blast
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
        });

        // ✅ Toast success
        toast.success('🎉 Task completed! Reward earned.');

        setOverlay(false);
      }
    }, 1000);
  };

  return {
    visitTask,
    overlay,
    countdown,
  };
}

const markTaskAsViewed = async (campaignId: string) => {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    console.error('Error getting user:', userError?.message);
    return;
  }

  // Prevent double views
  const { data: alreadyViewed } = await supabase
    .from('task_views')
    .select('*')
    .eq('user_id', user.id)
    .eq('campaign_id', campaignId)
    .maybeSingle();

  if (alreadyViewed) {
    toast.error('Task already viewed.');
    return;
  }

  const { error } = await supabase.from('tasks_views').insert([
    {
      user_id: user.id,
      campaign_id: campaignId,
    },
  ]);

  if (error) {
    console.error('Error recording task view:', error.message);
  } else {
    toast.success(`✅ Task ${campaignId} marked as viewed for user ${user.id}`);
  }

    // ✅ 2. Get the campaign reward
  const { data: campaign, error: campaignError } = await supabase
    .from('campaigns')
    .select('reward')
    .eq('id', campaignId)
    .single();

  if (campaignError || !campaign) {
    console.error('Error fetching reward:', campaignError?.message);
    return;
  }

  const reward = campaign.reward || 0;

  // ✅ 3. Update user earnings
  const { error: earningsError } = await supabase.rpc('increment_earnings', {
    user_id_input: user.id,
    amount_input: campaign.reward,
  });

  if (earningsError) {
    console.error('Error updating earnings:', earningsError.message);
  } else {
    toast.success(`💰 ${campaign.reward}`);
  }
};


