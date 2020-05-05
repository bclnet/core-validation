using System.Collections.Generic;

namespace CoreValidation.Bindings
{
  public interface ICastBinding
  {
    Dictionary<string, object> Errors { get; set; }
    Dictionary<string, object> State { get; set; }
  }

  public class CastBinding : AbstractBinding
  {
    public override IDictionary<string, object> GetErrors(object source) => ((ICastBinding)source).Errors;
    public override IDictionary<string, object> GetState(object source, object opts) => ((ICastBinding)source).State;
    public override void SetErrors(object source, IDictionary<string, object> errors) => ((ICastBinding)source).Errors = (Dictionary<string, object>)errors;
    public override void SetState(object source, object opts, IDictionary<string, object> state) => ((ICastBinding)source).State = (Dictionary<string, object>)state;
  }
}
