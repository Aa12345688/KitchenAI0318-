import React from "react";
import { useNavigate } from "react-router";
import { useIngredients } from "../services/IngredientContext";
import { useCamera } from "../hooks/useCamera";
import { CameraView } from "../components/scanner/CameraView";
import { DetectionSummary } from "../components/inventory_management/DetectionSummary";

export function Scanner() {
    const navigate = useNavigate();
    const { videoRef } = useCamera();

    return (
        <div className="pb-28">
            <div className="flex flex-col items-center justify-center px-6 pt-6 pb-3">
                <CameraView videoRef={videoRef} />
                <DetectionSummary />
                <p className="text-center text-gray-400 text-xs mt-8 px-10 leading-relaxed uppercase tracking-widest font-medium opacity-60">將鏡頭對準食材<br />AI 將自動辨識並同步庫存</p>
            </div>
        </div>
    );
}
