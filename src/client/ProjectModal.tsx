import React, { ReactElement, useEffect, useState } from 'react';

interface ProjectModalProps {
  show: boolean;
  onClose: () => void;
  onDeleteAndContinue: () => void;
  type: string;
}

const ProjectModal: React.FC<ProjectModalProps> = ({show,onClose,onDeleteAndContinue,type}) => {
  if (!show) return null; // Don't render the modal if not visible

  const [confirmed, setConfirmed] = useState<boolean>(false);
  useEffect(() => {
    console.log('show:',show);
    console.log('type:',type);
    console.log('confirmed:',confirmed);
  }, [confirmed, show]);

  return (
    <>
      {/* Modal Backdrop */}
      <div className="modal-backdrop fade show"></div>

      {/* Modal Content */}
      <div
        className="modal fade show"
        tabIndex={-1}
        role="dialog"
        style={{ display: 'block', zIndex: 1050 }}
      >
        <div className="modal-dialog" role="document">
          <div className="modal-content">
            <div className="modal-header bg-custom-blue">
              {type === 'alrDeployed' && (
                <h5 className="text-sub-text">Project Already Deployed</h5>
              )}
              {type === 'deploying' && (
                <h5 className="modal-title text-sub-text">Deploying project...</h5>
              )}
              {type === 'deleting' && (
                <h5 className="modal-title text-sub-text">Are you sure?</h5>
              )}
              <button type="button" className="close position-absolute top-0 end-0 m-2" onClick={onClose}>
                <span aria-hidden="true">&times;</span>
              </button>
            </div>

            {/* Modal Body */}
            <div className="modal-body text-black">
              {type === 'alrDeployed' && (
                <>
                  <p>
                    A project with this GitHub URL is already deployed. You can
                    only have one project per GitHub URL.
                  </p>
                  <p>Would you like to delete the old one and continue or cancel?</p>
                </>
              )}
              {type === 'deploying' && (
                <>
                  <p>Your project is currently being deployed. Please do not refresh/leave the page.</p>
                  <div className="d-flex justify-center mt-3">
                    <div className="spinner-border" role="status">
                      <span className="sr-only">Deploying...</span>
                    </div>
                  </div>
                </>
              )}
              {type === 'deleting' && (
                <div id="delete">
                  {confirmed ? (
                    <>
                      <p className="mt-3 text-sub-text">Your project is currently being undeployed and deleted.</p>
                      <div className="d-flex justify-center mt-3">
                        <div className="spinner-border" role="status">
                          <span className="sr-only">Deleting...</span>
                        </div>
                      </div>
                    </>
                  ) : (
                    <p>Are you sure you want to delete and undeploy this project?</p>
                  )}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="modal-footer">
              <button className="btn btn-secondary text-sub-text" onClick={onClose}>
                Cancel
              </button>
              {type === 'alrDeployed' && (
                <button className="btn btn-primary" style={{ backgroundColor: '#055ca6' }} onClick={onDeleteAndContinue}>
                  Delete and Continue
                </button>
              )}
              {type === 'deleting' && (!confirmed ? (
                <button className="btn btn-primary" style={{ backgroundColor: '#055ca6' }} onClick={
                  ()=>{
                    setConfirmed(true);
                    onDeleteAndContinue();
                  }}>
                  Delete
                </button>
              ):
              <div className="btn btn-primary disabled" style={{ backgroundColor: '#055ca6' }}>Deleting...</div>)}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProjectModal;
