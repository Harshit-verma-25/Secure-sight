"use client";

import { useState, useEffect } from "react";
import Header from "@/app/components/header";
import { Timeline, Controls, VideoPlayer } from "@/app/components/timeline";
import IncidentPanel from "@/app/components/incidentPanel";
import { Incident, Camera } from "@/app/types/incident";

export default function Home() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [cameras, setCameras] = useState<Camera[]>([]);
  const [resolvedCount, setResolvedCount] = useState(0);
  const [resolveId, setResolveId] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(0);

  const [activeThumbnail, setActiveThumbnail] = useState<string | null>(null);
  const [activeCamera, setActiveCamera] = useState<string | null>(null);
  const [activeIncident, setActiveIncident] = useState<string | null>(null);
  const [otherThumbnails, setOtherThumbnails] = useState<string[]>([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIncidents = async () => {
      try {
        const res = await fetch("/api/incidents?resolved=false");

        if (!res.ok) {
          throw new Error("Failed to fetch incidents");
        }

        const data = await res.json();
        const uniqueCamerasMap = new Map();

        data.incidents.forEach((incident: Incident) => {
          const camera = incident.camera;
          if (camera && !uniqueCamerasMap.has(camera.id)) {
            uniqueCamerasMap.set(camera.id, camera);
          }
        });

        const uniqueCameras = Array.from(uniqueCamerasMap.values());

        setCameras(uniqueCameras);

        setIncidents(data.incidents);
        setResolvedCount(data.resolvedCount);

        setActiveThumbnail(data.incidents[0]?.thumbnailUrl || null);
        setOtherThumbnails(() =>
          data.incidents
            .slice(1, 3)
            .map((incident: Incident) => incident.thumbnailUrl)
        );
        setActiveIncident(
          `${new Date(data.incidents[0]?.tsStart).toLocaleDateString("en-US", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })} ${new Date(data.incidents[0]?.tsStart).toLocaleTimeString(
            "en-US",
            {
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
            }
          )}`
        );
        setActiveCamera(data.incidents[0]?.camera?.name || null);
      } catch (error) {
        console.error("Failed to fetch incidents:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchIncidents();
  }, []);

  const handleTimeChange = (newTimeInSeconds: number) => {
    setCurrentTime(newTimeInSeconds);
  };

  const handleResolve = (incidentId: string) => {
    const response = fetch(`/api/incidents/${incidentId}/resolve`, {
      method: "PATCH",
    });

    response
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to resolve incident");
        }
        return res.json();
      })
      .then((updatedIncident) => {
        setIncidents((prev) =>
          prev.filter((incident) => incident.id !== updatedIncident.id)
        );
        setResolvedCount((prev) => prev + 1);
        setActiveThumbnail(updatedIncident.thumbnailUrl);
        setActiveIncident(
          `${new Date(updatedIncident.tsStart).toLocaleDateString("en-US", {
            day: "2-digit",
            month: "short",
            year: "numeric",
          })} ${new Date(updatedIncident.tsStart).toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
          })}`
        );
        setActiveCamera(updatedIncident.camera.name);
      })
      .catch((error) => {
        console.error("Error resolving incident:", error);
      });
  };

  useEffect(() => {
    if (resolveId) {
      handleResolve(resolveId);
    }
  }, [resolveId]);

  return (
    <section className="min-h-screen bg-[#1e1e1e] text-white">
      <Header />
      <div className="p-4 w-full h-full md:h-[60vh] bg-black text-white flex flex-col md:flex-row items-center justify-between gap-4">
        <VideoPlayer
          activeThumbnail={activeThumbnail}
          activeIncident={activeIncident}
          activeCamera={activeCamera}
          otherThumbnails={otherThumbnails}
        />

        {loading ? (
          <div className="h-full rounded-md w-1/2 flex items-center justify-center bg-[#131313]">
            <span className="text-white">Loading incidents...</span>
          </div>
        ) : (
          <IncidentPanel
            incidents={incidents}
            resolveCount={resolvedCount}
            setActiveThumbnail={setActiveThumbnail}
            setActiveIncident={setActiveIncident}
            setActiveCamera={setActiveCamera}
            setResolveId={setResolveId}
          />
        )}
      </div>

      {loading ? (
        <div className="h-[40vh] w-full p-4 flex justify-center bg-[#1e1e1e]">
          <span className="text-white">Loading timeline...</span>
        </div>
      ) : (
        <>
          <Controls />
          <Timeline
            cameras={cameras}
            incidents={incidents}
            currentTime={currentTime}
            onTimeChange={handleTimeChange}
            setActiveThumbnail={setActiveThumbnail}
            setActiveIncident={setActiveIncident}
            setActiveCamera={setActiveCamera}
          />
        </>
      )}
    </section>
  );
}
