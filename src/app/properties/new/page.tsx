"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { AppFrame } from "@/components/layout/AppFrame";
import { addListing, loadSession } from "@/lib/mvp";

const splitInput = (value: string) =>
  value
    .split(/[，,\s]+/)
    .map((item) => item.trim())
    .filter(Boolean);

export default function NewPropertyPage() {
  const [message, setMessage] = useState<string | null>(null);

  const [city, setCity] = useState("深圳");
  const [district, setDistrict] = useState("");
  const [compound, setCompound] = useState("");
  const [area, setArea] = useState("");
  const [layout, setLayout] = useState("");
  const [floorLevel, setFloorLevel] = useState<"High" | "Mid" | "Low">("Mid");
  const [buildingYear, setBuildingYear] = useState("2018");
  const [orientation, setOrientation] = useState("");
  const [estimatedValueWan, setEstimatedValueWan] = useState("");
  const [mortgage, setMortgage] = useState<"none" | "active">("active");
  const [photos, setPhotos] = useState("");

  const [targetDistricts, setTargetDistricts] = useState("");
  const [targetCompounds, setTargetCompounds] = useState("");
  const [minArea, setMinArea] = useState("");
  const [maxArea, setMaxArea] = useState("");
  const [cashGapMin, setCashGapMin] = useState("");
  const [cashGapMax, setCashGapMax] = useState("");

  const session = useMemo(() => loadSession(), []);
  const canPublish = session.accountState === "assetVerified";

  const onSubmit = () => {
    if (!canPublish) {
      setMessage("资产认证通过后才可发布 live 房源");
      return;
    }

    const photoList = splitInput(photos);
    if (photoList.length < 3 || photoList.length > 5) {
      setMessage("请填写 3 到 5 张房源图片描述或链接");
      return;
    }

    if (!district || !compound || !area || !layout || !orientation || !estimatedValueWan) {
      setMessage("请完成 Part A 所有必填项");
      return;
    }

    if (!targetDistricts || !minArea || !maxArea || !cashGapMin || !cashGapMax) {
      setMessage("请完成 Part B 所有必填项");
      return;
    }

    addListing({
      ownerId: "me",
      ownerName: "你",
      ownerIntent: Number(area) > Number(maxArea) ? "downsize" : "upsize",
      current: {
        city,
        district,
        compound,
        area: Number(area),
        layout,
        floorLevel,
        buildingYear: Number(buildingYear),
        orientation,
        estimatedValueWan: Number(estimatedValueWan),
        mortgage,
      },
      target: {
        districts: splitInput(targetDistricts),
        compounds: splitInput(targetCompounds),
        minArea: Number(minArea),
        maxArea: Number(maxArea),
        cashGapMinWan: Number(cashGapMin),
        cashGapMaxWan: Number(cashGapMax),
      },
      photos: photoList,
    });

    setMessage("发布成功：已进入匹配池，并自动触发 >80 分匹配通知检查。");
  };

  return (
    <AppFrame eyebrow="GIVE & GET FORM" title="发布我的置换需求（双向表单）">
      <div className="form-panel">
        <h2>Part A · My Current Property（我给什么）</h2>
        <div className="form-grid">
          <label>
            城市
            <input value={city} onChange={(e) => setCity(e.target.value)} />
          </label>
          <label>
            区
            <input value={district} onChange={(e) => setDistrict(e.target.value)} placeholder="南山" />
          </label>
          <label>
            小区名称
            <input value={compound} onChange={(e) => setCompound(e.target.value)} />
          </label>
          <label>
            面积（㎡）
            <input value={area} onChange={(e) => setArea(e.target.value)} />
          </label>
          <label>
            户型
            <input value={layout} onChange={(e) => setLayout(e.target.value)} placeholder="2室1厅1卫" />
          </label>
          <label>
            楼层
            <select value={floorLevel} onChange={(e) => setFloorLevel(e.target.value as "High" | "Mid" | "Low")}>
              <option value="High">High</option>
              <option value="Mid">Mid</option>
              <option value="Low">Low</option>
            </select>
          </label>
          <label>
            建成年份
            <input value={buildingYear} onChange={(e) => setBuildingYear(e.target.value)} />
          </label>
          <label>
            朝向
            <input value={orientation} onChange={(e) => setOrientation(e.target.value)} placeholder="南北通透" />
          </label>
          <label>
            估值（万）
            <input value={estimatedValueWan} onChange={(e) => setEstimatedValueWan(e.target.value)} />
          </label>
          <label>
            按揭状态
            <select value={mortgage} onChange={(e) => setMortgage(e.target.value as "none" | "active")}>
              <option value="active">有按揭</option>
              <option value="none">无按揭</option>
            </select>
          </label>
          <label className="full">
            照片（3-5项，逗号分隔）
            <input value={photos} onChange={(e) => setPhotos(e.target.value)} placeholder="客厅, 主卧, 厨房" />
          </label>
        </div>

        <h2>Part B · My Exchange Requirement（我想要什么）</h2>
        <div className="form-grid">
          <label>
            目标区域（多个用逗号）
            <input value={targetDistricts} onChange={(e) => setTargetDistricts(e.target.value)} placeholder="福田, 南山" />
          </label>
          <label>
            目标小区（可空）
            <input value={targetCompounds} onChange={(e) => setTargetCompounds(e.target.value)} placeholder="星河湾" />
          </label>
          <label>
            最小面积
            <input value={minArea} onChange={(e) => setMinArea(e.target.value)} />
          </label>
          <label>
            最大面积
            <input value={maxArea} onChange={(e) => setMaxArea(e.target.value)} />
          </label>
          <label>
            可接受现金差最小值（万）
            <input value={cashGapMin} onChange={(e) => setCashGapMin(e.target.value)} placeholder="例如 -250 或 200" />
          </label>
          <label>
            可接受现金差最大值（万）
            <input value={cashGapMax} onChange={(e) => setCashGapMax(e.target.value)} />
          </label>
        </div>

        <div className="form-actions">
          <button className="button button-primary" onClick={onSubmit}>
            发布 live 房源
          </button>
          <Link href="/matches" className="button button-ghost">
            去看匹配
          </Link>
        </div>

        {!canPublish ? <p>当前账号未通过资产认证，仅可填写体验，不能正式发布。</p> : null}
        {message ? <p>{message}</p> : null}
      </div>
    </AppFrame>
  );
}
