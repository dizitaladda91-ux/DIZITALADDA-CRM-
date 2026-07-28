import { Link} from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";

import {
  createCampaign,
  getCampaignById,
  updateCampaign,
} from "../../services/campaignService";
import "./CampaignForm.css";

const CampaignForm = () => {

  const navigate = useNavigate();

const {

  register,

  handleSubmit,

  reset,

  formState: {
    errors,
    isSubmitting,
  },

} = useForm({

  defaultValues: {

    status: "ACTIVE",

  },

});

const onSubmit = async (formData) => {

  try {

    if (isEdit) {

      await updateCampaign(id, formData);

      alert("Campaign Updated Successfully");

    } else {

      await createCampaign(formData);

      alert("Campaign Created Successfully");

    }

    navigate("/campaigns");

  } catch (error) {

    console.error(error);

    alert(

      error?.response?.data?.message ||

      "Something went wrong."

    );

  }

};

    const { id } = useParams();

    const isEdit = Boolean(id);

    return (

        <div className="campaign-form-page">

            {/* Breadcrumb */}

            <div className="campaign-breadcrumb">

                <Link to="/campaigns">

                    <ArrowLeft size={18} />

                    Back to Campaigns

                </Link>

            </div>

            {/* Header */}

            <div className="campaign-header">

                <h1>

                    {isEdit
                        ? "Edit Campaign"
                        : "Create Campaign"}

                </h1>

                <p>

                    Create or manage marketing campaigns.

                </p>

            </div>

            <form

className="campaign-form"

onSubmit={handleSubmit(onSubmit)}

>

                {/* Campaign Information */}

                <div className="form-grid">

  <div className="form-group">
    <label>Campaign Name *</label>
   <input
  type="text"
  placeholder="Enter campaign name"
  {...register("campaign_name", {
    required: "Campaign name is required",
  })}
/>

{errors.campaign_name && (
  <p className="error">
    {errors.campaign_name.message}
  </p>
)}
  </div>

  <div className="form-group">
    <label>Platform *</label>

   <select
  {...register("platform", {
    required: "Platform is required",
  })}
>
  <option value="">Select Platform</option>
  <option value="GOOGLE">Google</option>
  <option value="META">Meta</option>
  <option value="WEBSITE">Website</option>
  <option value="WHATSAPP">WhatsApp</option>
</select>

{errors.platform && (
  <p className="error">
    {errors.platform.message}
  </p>
)}

  </div>

  <div className="form-group">

    <label>Source *</label>

   <input
  type="text"
  placeholder="Google Search Ads"
  {...register("source", {
    required: "Source is required",
  })}
/>

{errors.source && (
  <p className="error">
    {errors.source.message}
  </p>
)}
  </div>

  <div className="form-group">

    <label>Budget *</label>
<input
  type="number"
  placeholder="75000"
  {...register("budget", {
    required: "Budget is required",
    min: {
      value: 1,
      message: "Budget must be greater than 0",
    },
  })}
/>

{errors.budget && (
  <p className="error">
    {errors.budget.message}
  </p>
)}

  </div>

  <div className="form-group full-width">

    <label>Landing Page URL</label>

   <input
  type="url"
  placeholder="https://dizitaladda.com/admission"
  {...register("landing_page_url")}
/>

  </div>

  <div className="form-group full-width">

    <label>Description</label>

    <textarea
  rows="4"
  placeholder="Campaign description..."
  {...register("description")}
/>

  </div>

</div>

                {/* Schedule */}

                <div className="form-grid">

  <div className="form-group">

    <label>Start Date</label>

   <input
  type="date"
  {...register("start_date")}
/>

  </div>

  <div className="form-group">

    <label>End Date</label>

   <input
  type="date"
  {...register("end_date")}
/>

  </div>

  <div className="form-group">

    <label>Status</label>

   <select
  {...register("status")}
>

  <option value="ACTIVE">Active</option>

  <option value="PAUSED">Paused</option>

  <option value="COMPLETED">Completed</option>

</select>

  </div>

</div>

                {/* Tracking */}

              <div className="form-grid">

  <div className="form-group">

    <label>UTM Source</label>

    <input
  type="text"
  placeholder="google"
  {...register("utm_source")}
/>

  </div>

  <div className="form-group">

   <input
  type="text"
  placeholder="cpc"
  {...register("utm_medium")}
/>

  </div>

  <div className="form-group">

    <label>UTM Campaign</label>

    <input
  type="text"
  placeholder="bca_admission_2027"
  {...register("utm_campaign")}
/>

  </div>

  <div className="form-group">

    <label>UTM Content</label>

    <input
  type="text"
  placeholder="video_1"
  {...register("utm_content")}
/>

  </div>

  <div className="form-group">

    <label>UTM Term</label>

    <input
  type="text"
  placeholder="bca"
  {...register("utm_term")}
/>

  </div>

</div>

                {/* Footer */}

                <div className="campaign-footer">

                    <button
                        type="button"
                        className="btn-secondary"
                    >

                        Cancel

                    </button>

                    <button
  type="submit"
  className="btn-primary"
  disabled={isSubmitting}
>

  {isSubmitting
    ? "Saving..."
    : isEdit
      ? "Update Campaign"
      : "Create Campaign"}

</button>

                </div>

            </form>

        </div>

    );

};

export default CampaignForm;
