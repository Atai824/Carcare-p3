import { useForm } from "react-hook-form";
import { createCar } from "../api";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

export default function AddCar() {
  const { register, handleSubmit, formState:{errors,isSubmitting} } = useForm();
  const navigate = useNavigate();
  const [error,setError] = useState("");

  const onSubmit = async (data) => {
    setError("");
    try {
      await createCar({
        make: data.make,
        model: data.model,
        year: Number(data.year),
        vin: data.vin || "",
        mileage: Number(data.mileage || 0),
        nickname: data.nickname || "",
      });
      navigate("/dashboard");
    } catch (e) {
      setError("Couldn't create car");
      console.error(e);
    }
  };

  return (
    <div className="container-fluid px-3 px-md-4 py-4">
      <h2 className="mb-3">Add Car</h2>
      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit(onSubmit)} style={{maxWidth: 520}}>
        <div className="row g-3">
          <div className="col-sm-6">
            <label className="form-label">Make</label>
            <input className="form-control" {...register("make",{required:true})}/>
            {errors.make && <div className="text-danger small">Required</div>}
          </div>
          <div className="col-sm-6">
            <label className="form-label">Model</label>
            <input className="form-control" {...register("model",{required:true})}/>
            {errors.model && <div className="text-danger small">Required</div>}
          </div>
          <div className="col-sm-4">
            <label className="form-label">Year</label>
            <input type="number" className="form-control" {...register("year",{required:true})}/>
          </div>
          <div className="col-sm-8">
            <label className="form-label">VIN</label>
            <input className="form-control" {...register("vin")}/>
          </div>
          <div className="col-sm-6">
            <label className="form-label">Mileage</label>
            <input type="number" className="form-control" {...register("mileage")}/>
          </div>
          <div className="col-sm-6">
            <label className="form-label">Nickname</label>
            <input className="form-control" {...register("nickname")}/>
          </div>
        </div>

        <button disabled={isSubmitting} className="btn btn-primary mt-3">
          {isSubmitting ? "Saving..." : "Create"}
        </button>
      </form>
    </div>
  );
}
