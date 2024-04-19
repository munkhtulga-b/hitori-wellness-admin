import StaffTimeSlotForm from "./StaffTimeSlotForm";

const ActiveSlotModal = ({ data, closeModal }) => {
  return (
    <>
      {data ? <StaffTimeSlotForm data={data} closeModal={closeModal} /> : null}
    </>
  );
};

export default ActiveSlotModal;
